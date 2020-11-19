import express from 'express';
import { BaseController } from './base-controller';
import { ProgramExecutor } from '../service/program-executor';
import { ProgramExecutorCommand } from '../service/executor/program-executor-command';
import { LanguageMetadataFactory } from '../service/language-metadata-factory';
import { ExecutionRequest } from '../dto/request/execution-request';

export class ExecutorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/executor';

  private programExecutor: ProgramExecutor

  private metadataFactory: LanguageMetadataFactory

  constructor() {
    super();
    this.programExecutor = new ProgramExecutor()
    this.metadataFactory = new LanguageMetadataFactory()
  }

  initialiseRoutes(): void {
    this.router.post(this.BASE_PATH, this.executeHandler)
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

    const result = await this.programExecutor.run(executionRequest.code)

    // execute request code block
    res.send(result)
  };
}
