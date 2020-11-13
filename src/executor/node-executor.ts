import { Executor } from './executor';
import { ExecuteResponse } from '../dto/response/execute-response';
import { Status } from '../util/status';

export class NodeExecutor implements Executor {
  // TODO - implement the actual `NODE` code block execution logic
  execute(code: string, input: string[], output: string[]): Promise<ExecuteResponse> {
    return new Promise<ExecuteResponse>((resolve) =>
      resolve({ status: Status.SUCCESS, log: 'NODE successfully executed' })
    );
  }
}
