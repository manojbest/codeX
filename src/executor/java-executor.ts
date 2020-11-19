import { Executor } from './executor';
import { ExecuteResponse } from '../dto/response/execute-response';
import { Status } from '../util/status';
import { docker } from '../util/docker';
import { Logger } from '../util/logger';
import { DOCKER_IMAGE_TEST_TAGS } from '../constant/common-constants';
import { Type } from '../util/type';
import { fileManager } from '../util/file-manager';
import { WritableStream } from 'memory-streams';
import { nameGenerator } from '../util/name-generator';

export class JavaExecutor implements Executor {
  // base path for all java temp files
  private static BASE_DIRECTORY = `${process.env.PROJECT_ROOT}/vault/java`;

  /**
   * Format code block
   *
   * @param className - the JAVA class name
   * @param code - the user given code block (should be static main function)
   * @private
   */
  private formatCodeBlock(className: string, code: string): string {
    return `public class ${className} { ${code} }`;
  }

  async execute(code: string, input: string[], output: string[]): Promise<ExecuteResponse> {
    const stdout = new WritableStream();
    const stderr = new WritableStream();
    return new Promise<ExecuteResponse>(async (resolve) => {
      try {
        // generate random classname
        const className = nameGenerator.generateName();
        // file name should be equal as the main classname
        const fileName = `${className}.java`;
        // create temp file
        fileManager.createFile(
          JavaExecutor.BASE_DIRECTORY,
          fileName,
          this.formatCodeBlock(className, code),
          { encoding: 'utf-8' }
        );
        // execute container
        // pmd -d Sample.java -R rulesets/java/quickstart.xml -f text
        // ['sh', '-c', `java -version && cd /workspace && javac ${fileName} && java ${className}`],
        const [output, container] = await docker.run(
            DOCKER_IMAGE_TEST_TAGS[Type.JAVA],
          ['sh', '-c', `java -version && pwd && pmd -d ${fileName} -R rulesets/java/quickstart.xml -f text`],
          [stdout, stderr],
          {
            Volumes: {
              '/': {},
            },
            HostConfig: {
              Binds: [`${JavaExecutor.BASE_DIRECTORY}:/`],
            },
          }
        );

        Logger.info(output);
        Logger.info('stdout :', stdout.toString());
        Logger.info('stderr :', stderr.toString());

        // remove container once program execution finishes
       // await container.remove();

        // resolve request as SUCCESS
        resolve({ status: Status.SUCCESS, log: stdout.toString() });
      } catch (error) {
        Logger.error('failed to create JAVA container : ', error);
        // resolve request as ERROR status with log
        resolve({ status: Status.ERROR, log: stderr.toString() });
      }
    });
  }
}
