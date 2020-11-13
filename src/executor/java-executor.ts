import { Executor } from './executor';
import { ExecuteResponse } from '../dto/response/execute-response';
import { Status } from '../util/status';
import { docker } from '../util/docker';
import { Logger } from '../util/logger';
import { v4 } from 'uuid';
import { DOCKER_IMAGE_TAGS } from '../constant/common-constants';
import { Type } from '../util/type';
import { fileManager } from '../util/file-manager';

export class JavaExecutor implements Executor {
  // base path for all java temp files
  private static BASE_DIRECTORY = `${process.env.PROJECT_ROOT}/vault/java`;

  // TODO - implement the actual `JAVA` code block execution logic
  async execute(code: string, input: string[], output: string[]): Promise<ExecuteResponse> {
    try {
      // generate random id
      const fileName = `${v4()}.java`;
      // create temp file
      fileManager.createFile(JavaExecutor.BASE_DIRECTORY, fileName, code, { encoding: 'utf-8' });

      // create container
      const container = await docker.createContainer({
        Image: DOCKER_IMAGE_TAGS[Type.JAVA],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Volumes: {
          '/workspace': {},
        },
        HostConfig: {
          Binds: [`${JavaExecutor.BASE_DIRECTORY}:/workspace`],
        },
        Cmd: [`javac /workspace/${fileName} && java ${fileName.replace('.java', '')}`],
      });

      // listeners
      container.inspect((error, result) => Logger.info('container : ', result));
      container.start((error, result) => Logger.info('container (start) : ', result));
      container.remove((error, result) => Logger.info('container (remove) : ', result));

      // copy code
      // await container.putArchive(fileName, { path: '~/' });
      // await container.start();
    } catch (error) {
      Logger.error('failed to create JAVA container : ', error);
    }
    return { status: Status.SUCCESS, log: 'JAVA successfully executed' };
  }
}
