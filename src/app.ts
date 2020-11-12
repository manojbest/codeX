import express from 'express';
import compression from 'compression';
import { json } from 'body-parser';
import { BaseController } from './controller/base-controller';
import { Logger } from './util/logger';

export class App {
  private app: express.Application;
  private readonly port: number;

  constructor(controllers: BaseController[], port: number) {
    this.app = express();
    this.port = port;
    // initialise middlewares
    this.initialiseMiddlewares();
    // initialise controllers
    this.initialiseControllers(controllers);
  }

  /**
   * Initialise all application middlewares
   *
   * @private
   */
  private initialiseMiddlewares() {
    // compression parser
    this.app.use(compression());
    // body-parser
    this.app.use(json());
    // router request logging
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        Logger.info(`router : ${req.method.toUpperCase()} >> '${req.url}'`);
        next();
      }
    );
  }

  /**
   * Initialise all application controllers with app routes
   *
   * @param controllers - the list of controllers
   * @private
   */
  private initialiseControllers(controllers: BaseController[]) {
    controllers.forEach((controller: BaseController) => {
      // initialise the controller routes
      controller.initialiseRoutes();
      // attach to app routing
      this.app.use('/', controller.router);
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      Logger.info(`Server is running at localhost:${this.port}`);
    });
  }
}
