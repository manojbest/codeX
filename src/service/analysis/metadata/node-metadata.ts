import {AnalysisMetadata} from './analysis-metadata'
import {Type} from '../../../util/type'

export class NodeMetadata implements AnalysisMetadata{

    getAnalysisCommands(): string[] {
        return [''];
    }

    getLanguageName(): Type {
        return Type.NODE;
    }

}
