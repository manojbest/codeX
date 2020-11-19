import { LanguageMetadata } from './language-metadata';
import { Type } from '../../../util/type';

export class PythonMetadata implements LanguageMetadata {
  getExecuteCommands(): string[] {
    return ['python'];
  }

  getFileExtension(): string {
    return '.py';
  }

  getLanguageName(): Type {
    return Type.PYTHON;
  }

  getVersion(): string {
    return 'python --version';
  }
}
