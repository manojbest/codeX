import { ExecuteResponse } from '../dto/response/execute-response';

export interface Executor {
  /**
   * Program execute method
   *
   * @param code - the user given code block
   * @param input - the evaluating input criteria
   * @param output - the evaluating output criteria
   */
  execute(code: string, input: string[], output: string[]): ExecuteResponse;
}
