import { AnalysisMetadata } from './analysis-metadata';
import { CustomType } from '../../../util/type';

export class JavaMetadata implements AnalysisMetadata {
  getAnalysisCommands(): string[] {
    return ['/pmd-bin-6.29.0/bin/run.sh pmd -d', '-R rulesets/java/quickstart.xml -f text'];
  }

  getLanguageName(): CustomType {
    return CustomType.CUSTOM_JAVA;
  }

  public getVersion(): string {
    return 'java -version';
  }

  public getFileExtension(): string {
    return '.java';
  }
}
