import { Executor } from './executor';
import { ExecuteResponse } from '../dto/response/execute-response';
import { Status } from '../util/status';

export class PythonExecutor implements Executor {
  // TODO - implement the actual `PYTHON` code block execution logic
  execute(code: string, input: string[], output: string[]): ExecuteResponse {
    return { status: Status.SUCCESS, log: 'PYTHON successfully executed' };
  }
}
