import {AnalysisMetadata} from './analysis-metadata'
import {Type} from '../../../util/type'

export class JavaMetadata implements AnalysisMetadata{

    getAnalysisCommands(): string[] {
        return ['pmd', 'findbug'];
    }

    getLanguageName(): Type {
        return Type.JAVA;
    }

}
