import { ProgramCommand } from '../program-command';
import { LanguageMetadata } from '../metadata/language-metadata';
import { nameGenerator } from '../../util/name-generator';
import { fileManager } from '../../util/file-manager';
import { docker } from '../../util/docker';
import { DOCKER_IMAGE_TAGS } from '../../constant/common-constants';
import { Logger } from '../../util/logger';
import { Status } from '../../util/status';
import { WritableStream } from 'memory-streams';
import { ExecutionResponse } from '../../dto/response/execution-response';
import { Type } from '../../util/type';

export class ProgramExecutorCommand implements ProgramCommand {
  private static BASE_DIRECTORY = `${process.env.PROJECT_ROOT}/vault/java`;

  private programMetaData: LanguageMetadata;

  constructor(program: LanguageMetadata) {
    this.programMetaData = program;
  }

  public async execute(code: string): Promise<ExecutionResponse> {
    const stdout = new WritableStream();
    const stderr = new WritableStream();
    let result: ExecutionResponse;

    try {
      // generate random classname
      const className = nameGenerator.generateName();
      // file name should be equal as the main classname

      const fileName = `${className}${this.programMetaData.getFileExtension()}`;

      // I believe this needs to be removed. User should submit the complete program.
      // But to make it works as before refactoring, I added this
      const formattedCode =
        this.programMetaData.getLanguageName() == Type.JAVA
          ? this.formatCodeBlock(className, code)
          : code;

      // create temp file
      fileManager.createFile(ProgramExecutorCommand.BASE_DIRECTORY, fileName, formattedCode, {
        encoding: 'utf-8',
      });

      const executionCommand: string =
        this.programMetaData.getExecuteCommands().length > 1
          ? `${this.programMetaData.getExecuteCommands()[0]} ${fileName} && ${
              this.programMetaData.getExecuteCommands()[1]
            } ${className}`
          : `${this.programMetaData.getExecuteCommands()[0]} ${fileName}`;
      Logger.info('Execution Command', executionCommand);
      // execute container
      const [output, container] = await docker.run(
        DOCKER_IMAGE_TAGS[this.programMetaData.getLanguageName()],
        [
          'sh',
          '-c',
          `${this.programMetaData.getVersion()} && cd /workspace && ${executionCommand}`,
        ],
        [stdout, stderr],
        {
          Volumes: {
            '/workspace': {},
          },
          HostConfig: {
            Binds: [`${ProgramExecutorCommand.BASE_DIRECTORY}:/workspace`],
          },
        }
      );

      Logger.info(output);
      Logger.info('stdout :', stdout.toString());
      Logger.info('stderr :', stderr.toString());

      // remove container once program execution finishes
      await container.remove();
      // resolve request as SUCCESS
      result = { status: Status.SUCCESS, log: stdout.toString() };
    } catch (error) {
      Logger.error('failed to create JAVA container : ', error);
      // resolve request as ERROR status with log
      result = { status: Status.ERROR, log: stderr.toString() };
    }

    return Promise.resolve(result);
  }

  //  this may not be required
  private formatCodeBlock(className: string, code: string): string {
    return `public class ${className} { ${code} }`;
  }
}
