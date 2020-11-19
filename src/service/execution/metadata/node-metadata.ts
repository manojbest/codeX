import { LanguageMetadata } from './language-metadata';
import { Type } from '../../../util/type';

export class NodeMetadata implements LanguageMetadata {
  getExecuteCommands(): string[] {
    return ['node'];
  }

  getFileExtension(): string {
    return '.js';
  }

  getLanguageName(): Type {
    return Type.NODE;
  }

  getVersion(): string {
    return 'node --version';
  }
}
