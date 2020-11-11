import express from 'express';
import { BaseController } from './base-controller';

export class ActuatorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/actuator';

  initialiseRoutes(): void {
    this.router.get(`${this.BASE_PATH}/info`, this.infoHandler);
    this.router.get(`${this.BASE_PATH}/health`, this.healthHandler);
  }

  /**
   * Handles the actuator info
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private infoHandler = (req: express.Request, res: express.Response) => {
    res.send({
      name: process.env.NAME,
      description: process.env.DESCRIPTION,
      version: process.env.VERSION,
    });
  };

  /**
   * Handles the actuator health
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private healthHandler = (req: express.Request, res: express.Response) => {
    res.send({
      status: 'UP',
    });
  };
}
