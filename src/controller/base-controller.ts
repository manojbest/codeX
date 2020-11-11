import express from 'express';

/**
 * The base controller class for all controllers
 */
export abstract class BaseController {
  public router = express.Router();

  /**
   * abstract method to used in every sub controllers, which gets initialised on the bootstrap level
   * with the express router
   */
  abstract initialiseRoutes(): void;
}
