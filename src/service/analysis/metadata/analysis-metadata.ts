import {Type} from '../../../util/type'

export interface AnalysisMetadata {
    getAnalysisCommands(): string[];
    getLanguageName(): Type;
}
