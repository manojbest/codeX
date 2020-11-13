import { ExecuteResponse } from '../../dto/response/execute-response';
import { ExecuteRequest } from '../../dto/request/execute-request';

export interface ExecutorService {
  /**
   * The execute method to trigger proper executor for given code
   *
   * @param request - the request payload
   */
  execute(request: ExecuteRequest): Promise<ExecuteResponse>;
}
