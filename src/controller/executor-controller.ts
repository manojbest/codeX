import express, {response} from 'express';
import { BaseController } from './base-controller';
import {Docker} from '../util/docker'
import {DOCKER_IMAGE_TAGS} from '../constant/common-constants'
import * as streams from 'memory-streams'
import {Logger} from '../util/logger'

export class ExecutorController extends BaseController {
  // the base path of the controller
  private BASE_PATH = '/executor';

  initialiseRoutes(): void {
    this.router.get(this.BASE_PATH, this.executeHandler);
  }

  /**
   * Handles the execution POST request
   *
   * @param req - the request payload
   * @param res - the response payload
   */
  private executeHandler = async (req: express.Request, res: express.Response) => {

    const stdout = new streams.WritableStream()
    const stderr = new streams.WritableStream()

    try {
      const [ output, container ] = await Docker.run(
          DOCKER_IMAGE_TAGS[0],
          ['sh', '-c', 'echo test; echo testerr >/dev/stderr; java -version'],
          [stdout, stderr],
          { Tty: false }
      )

      Logger.info(output)
      Logger.info('stdout :', stdout.toString())
      Logger.info('stderr :', stderr.toString())

      //remove container once program execution finishes
      await container.remove()

      res.send({
        language: 'Java',
        version: stderr.toString()
      });
    } catch(error) {
      Logger.error('Error Occurred :', error)
    }

  };
}
