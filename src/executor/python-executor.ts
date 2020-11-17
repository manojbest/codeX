import { Executor } from './executor';
import { ExecuteResponse } from '../dto/response/execute-response';
import { Status } from '../util/status';
import { WritableStream } from 'memory-streams';
import { nameGenerator } from '../util/name-generator';
import { fileManager } from '../util/file-manager';
import { docker } from '../util/docker';
import { DOCKER_IMAGE_TAGS } from '../constant/common-constants';
import { Type } from '../util/type';
import { Logger } from '../util/logger';

export class PythonExecutor implements Executor {
  // base path for all python temp files
  private static BASE_DIRECTORY = `${process.env.PROJECT_ROOT}/vault/python`;

  async execute(code: string, input: string[], output: string[]): Promise<ExecuteResponse> {
    const stdout = new WritableStream();
    const stderr = new WritableStream();
    return new Promise<ExecuteResponse>(async (resolve) => {
      try {
        // python script name
        const scriptName = `${nameGenerator.generateName()}.py`;
        // create temp file
        fileManager.createFile(PythonExecutor.BASE_DIRECTORY, scriptName, code, {
          encoding: 'utf-8',
        });
        // execute container
        const [output, container] = await docker.run(
          DOCKER_IMAGE_TAGS[Type.PYTHON],
          ['sh', '-c', `python --version && cd /workspace && python ${scriptName}`],
          [stdout, stderr],
          {
            Volumes: {
              '/workspace': {},
            },
            HostConfig: {
              Binds: [`${PythonExecutor.BASE_DIRECTORY}:/workspace`],
            },
          }
        );

        Logger.info(output);
        Logger.info('stdout :', stdout.toString());
        Logger.info('stderr :', stderr.toString());

        // remove container once program execution finishes
        await container.remove();

        // resolve request as SUCCESS
        resolve({ status: Status.SUCCESS, log: stdout.toString() });
      } catch (error) {
        Logger.error('failed to create PYTHON container : ', error);
        // resolve request as ERROR status with log
        resolve({ status: Status.ERROR, log: stderr.toString() });
      }
    });
  }
}
