import { LanguageMetadata } from './language-metadata';
import { Type } from '../../util/type';

export class JavaMetadata implements LanguageMetadata {
  public getExecuteCommands(): string[] {
    return ['javac', 'java'];
  }

  public getVersion(): string {
    return 'java -version';
  }

  public getFileExtension(): string {
    return '.java';
  }

  public getLanguageName(): Type {
    return Type.JAVA;
  }
}
