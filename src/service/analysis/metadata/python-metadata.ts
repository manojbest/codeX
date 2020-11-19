import { AnalysisMetadata } from './analysis-metadata';
import { CustomType } from '../../../util/type';

export class PythonMetadata implements AnalysisMetadata {
  getAnalysisCommands(): string[] {
    return ['prospector --tool pylint --tool pep8 --tool dodgy --tool mccabe'];
  }

  getFileExtension(): string {
    return '.py';
  }

  getLanguageName(): CustomType {
    return CustomType.CUSTOM_PYTHON;
  }

  getVersion(): string {
    return 'python --version';
  }
}
