import { Type } from '../../../util/type';

export interface LanguageMetadata {
  getExecuteCommands(): string[];
  getVersion(): string;
  getFileExtension(): string;
  getLanguageName(): Type;
}
