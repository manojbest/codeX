import { ExecutionResponse } from '../dto/response/execution-response';
import { AnalysisResponse } from '../dto/response/analyze-response';

export interface ProgramCommand {
  execute(code: string): Promise<ExecutionResponse | AnalysisResponse>;
}
