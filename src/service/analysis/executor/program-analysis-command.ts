import {ProgramCommand} from '../../program-command'
import {AnalysisResponse} from '../../../dto/response/analysis-response'
import {AnalysisMetadata} from '../metadata/analysis-metadata'
import {Type} from '../../../util/type';

export class ProgramAnalysisCommand implements ProgramCommand {

    private analysisMetaData: AnalysisMetadata = {} as AnalysisMetadata

    constructor(analysisMetadata: AnalysisMetadata) {
        this.analysisMetaData = analysisMetadata
    }

    execute(code: string): Promise<AnalysisResponse> {

        const commands = this.analysisMetaData.getAnalysisCommands()
        const type: Type =  this.analysisMetaData.getLanguageName()

        // add logic as required
        return {} as Promise<AnalysisResponse>
    }

}
