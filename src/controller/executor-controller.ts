import express from 'express';
import { BaseController } from './base-controller';
import { ExecutorService } from '../service/contract/executor-service';
import { ExecutorServiceImpl } from '../service/impl/executor-service-impl';

export class ExecutorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/executor';
  // the executor service instance
  private executorService: ExecutorService;

  constructor() {
    super();
    this.executorService = new ExecutorServiceImpl();
  }

  initialiseRoutes(): void {
    this.router.post(this.BASE_PATH, this.executeHandler);
  }

  /**
   * Handles the execution POST request
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private executeHandler = (req: express.Request, res: express.Response) => {
    // execute request code block
    res.send(this.executorService.execute(req.body));
  };
}
