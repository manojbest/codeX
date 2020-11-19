import { CustomType } from '../../../util/type';

export interface AnalysisMetadata {
  getAnalysisCommands(): string[];
  getLanguageName(): CustomType;
  getVersion(): string;
  getFileExtension(): string;
}
