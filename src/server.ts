import { dockerRunner } from './util/docker-files/docker-runner';
import { Logger } from './util/logger';
import { App } from './app';
import { ExecutorController } from './controller/executor-controller';
import { BaseController } from './controller/base-controller';
import { ActuatorController } from './controller/actuator-controller';

const port: number = parseInt(process.env.PORT || '7070');

// all application controllers should register here
const controllers: BaseController[] = [new ActuatorController(), new ExecutorController()];

// initialize app instance
const app = new App(controllers, port);

// bootstrap docker
dockerRunner.testBootstrap().then(() => {
  // success
  app.start();
});

process.on('uncaughtException', (err) => {
  Logger.error('uncaughtException : ', err.message, err.stack);
  process.exit(1);
});
