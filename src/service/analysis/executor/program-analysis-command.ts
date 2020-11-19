import { ProgramCommand } from '../../program-command';
import { AnalysisResponse } from '../../../dto/response/analyze-response';
import { CustomType } from '../../../util/type';
import { AnalysisMetadata } from '../metadata/analysis-metadata';
import { nameGenerator } from '../../../util/name-generator';
import { fileManager } from '../../../util/file-manager';
import { Logger } from '../../../util/logger';
import { docker } from '../../../util/docker';
import { Status } from '../../../util/status';
import { WritableStream } from 'memory-streams';
import { CUSTOM_DOCKER_IMAGES } from '../../../constant/common-constants';

export class ProgramAnalysisCommand implements ProgramCommand {
  private static BASE_DIRECTORY = `${process.env.PROJECT_ROOT}/vault/java`;
  private analysisMetaData: AnalysisMetadata = {} as AnalysisMetadata;

  constructor(analysisMetadata: AnalysisMetadata) {
    this.analysisMetaData = analysisMetadata;
  }

  public async execute(code: string): Promise<AnalysisResponse> {
    const stdout = new WritableStream();
    const stderr = new WritableStream();
    let result: AnalysisResponse;

    try {
      // generate random classname
      const className = nameGenerator.generateName();
      // file name should be equal as the main classname

      const fileName = `${className}${this.analysisMetaData.getFileExtension()}`;

      // I believe this needs to be removed. User should submit the complete program.
      // But to make it works as before refactoring, I added this
      const formattedCode =
        this.analysisMetaData.getLanguageName() == CustomType.CUSTOM_JAVA
          ? this.formatCodeBlock(className, code)
          : code;

      // create temp file
      fileManager.createFile(ProgramAnalysisCommand.BASE_DIRECTORY, fileName, formattedCode, {
        encoding: 'utf-8',
      });
      const analyzeCommands: string =
        this.analysisMetaData.getAnalysisCommands().length > 1
          ? `${this.analysisMetaData.getAnalysisCommands()[0]} ${fileName} ${
              this.analysisMetaData.getAnalysisCommands()[1]
            }`
          : `${this.analysisMetaData.getAnalysisCommands()[0]} ${fileName}`;

      Logger.info('Execution Command', analyzeCommands);
      // execute container
      const [output, container] = await docker.run(
        `${CUSTOM_DOCKER_IMAGES[this.analysisMetaData.getLanguageName()].tag}:latest`,
        [
          'sh',
          '-c',
          `${this.analysisMetaData.getVersion()} && cd /workspace && ${analyzeCommands}`,
        ],
        [stdout, stderr],
        {
          Volumes: {
            '/workspace': {},
          },
          HostConfig: {
            Binds: [`${ProgramAnalysisCommand.BASE_DIRECTORY}:/workspace`],
          },
        }
      );

      Logger.info(output);
      Logger.info('stdout :', stdout.toString());
      Logger.info('stderr :', stderr.toString());

      // remove container once program execution finishes
      await container.remove();
      // resolve request as SUCCESS
      result = { status: Status.SUCCESS, report: stdout.toString() };
    } catch (error) {
      Logger.error('failed to create JAVA container : ', error);
      // resolve request as ERROR status with log
      result = { status: Status.ERROR, report: stderr.toString() };
    }

    return Promise.resolve(result);
  }

  //  this may not be required
  private formatCodeBlock(className: string, code: string): string {
    return `public class ${className} { ${code} }`;
  }
}
