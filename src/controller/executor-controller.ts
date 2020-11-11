import express from 'express';
import { BaseController } from './base-controller';

export class ExecutorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/executor';

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
    res.send('it works');
  };
}
