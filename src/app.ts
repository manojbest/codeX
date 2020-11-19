import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { json } from 'body-parser';
import { BaseController } from './controller/base-controller';
import { Logger } from './util/logger';
import { textSync } from 'figlet';
import { Server } from 'http';
import { socket } from './util/socket';

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
    // allow CORS
    this.app.use(cors());
    // compression parser
    this.app.use(compression());
    // body-parser
    this.app.use(json());
    // router request logging
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      Logger.info(`router : ${req.method.toUpperCase()} >> '${req.url}'`);
      next();
    });
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
    // start express server
    const server: Server = this.app.listen(this.port, () => {
      // fancy console output. :)
      console.log(textSync('codeX', { font: 'Speed' }));
      Logger.info(`Server is running at localhost:${this.port}`);
    });
    // attach express server to socket context
    socket.attach(server);
  }
}
