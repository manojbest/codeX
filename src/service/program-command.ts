import { ExecutionResponse } from '../dto/response/execution-response';

export interface ProgramCommand {
  execute(code: string): Promise<ExecutionResponse>;
}
