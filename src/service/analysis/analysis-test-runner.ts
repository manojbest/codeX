import {ProgramExecutor} from '../program-executor'
import {AnalysisMetadataFactory} from './analysis-metadata-factory'
import {Type} from '../../util/type'
import {ProgramAnalysisCommand} from './executor/program-analysis-command'

export class AnalysisTestRunner {

    private programExecutor: ProgramExecutor

    private metadataFactory: AnalysisMetadataFactory

    constructor() {
        this.programExecutor = new ProgramExecutor()
        this.metadataFactory = new AnalysisMetadataFactory()
    }

    public async testAnalysis(type: Type, code: string) {
        this.programExecutor.setCommand(
            new ProgramAnalysisCommand(
                this.metadataFactory.getAnalysisMetaDataInstance(type)
            )
        );

        const result = await this.programExecutor.run(code)
    }
}
