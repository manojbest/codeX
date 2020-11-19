import express from 'express';
import { BaseController } from './base-controller';
import { ProgramExecutor } from '../service/program-executor';
import { ProgramExecutorCommand } from '../service/execution/executor/program-executor-command';
import { LanguageMetadataFactory } from '../service/execution/language-metadata-factory';
import { ExecutionRequest } from '../dto/request/execution-request';
import { Queue } from '../util/queue';
import { Logger } from '../util/logger';
import { AnalysisMetadataFactory } from '../service/analysis/analysis-metadata-factory';
import { socket } from '../util/socket';
import { SubmitRequest } from '../dto/request/submit-request';

export class ExecutorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/executor';

  private programExecutor: ProgramExecutor;
  private metadataFactory: LanguageMetadataFactory;
  private metadataAnalysisFactory: AnalysisMetadataFactory;
  private questionsQueue: Queue;

  constructor() {
    super();
    this.programExecutor = new ProgramExecutor();
    this.metadataFactory = new LanguageMetadataFactory();
    this.metadataAnalysisFactory = new AnalysisMetadataFactory();
    this.questionsQueue = new Queue((task) => {
      // TODO - implement code analysis execution call
      console.log('Async task : ', task);
      // if error occurred, pass error value, otherwise it should be `NULL`
      return { error: null, result: task };
    });
  }

  initialiseRoutes(): void {
    this.router.post(this.BASE_PATH, this.executeHandler);
    this.router.post(`${this.BASE_PATH}/submit`, this.submitHandler);
  }

  /**
   * Handles the execution POST request
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private executeHandler = async (req: express.Request, res: express.Response) => {
    const executionRequest: ExecutionRequest = req.body as ExecutionRequest;

    this.programExecutor.setCommand(
      new ProgramExecutorCommand(
        this.metadataFactory.getLanguageMetadataInstance(executionRequest.type)
      )
    );

    const result = await this.programExecutor.run(executionRequest.code);

    // execute request code block
    res.send(result);
  };

  /**
   * Handles the submit POST request
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private submitHandler = (req: express.Request, res: express.Response) => {
    const executionRequest: SubmitRequest = req.body as SubmitRequest;

    // push request to queue
    const task = this.questionsQueue.push(executionRequest);

    // add listener for task execution
    // TODO - implement socket or server push to inform results back to user
    task
      .on('progress', (progress) => {
        Logger.info('task in-progress : ', progress);
        socket.emit(executionRequest.socketId, { loading: true, error: null });
      })
      .on('finish', (data) => {
        Logger.info('task finish : ', data);
        socket.emit(executionRequest.socketId, { loading: false, error: null, result: data });
      })
      .on('failed', (error) => {
        Logger.error('task failed : ', error);
        socket.emit(executionRequest.socketId, { loading: false, error });
      });

    // send status only, void response
    res.status(200).send();
  };
}
