import { AnalysisMetadata } from './analysis-metadata';
import { CustomType } from '../../../util/type';

export class NodeMetadata implements AnalysisMetadata {
  getFileExtension(): string {
    return '.js';
  }

  getLanguageName(): CustomType {
    return CustomType.CUSTOM_NODE;
  }

  getVersion(): string {
    return 'node --version';
  }

  getAnalysisCommands(): string[] {
    return ['node'];
  }
}
