/**
 * Execute response payload
 */
import { Status } from '../../util/status';

export interface ExecutionResponse {
  log: string;
  status: Status;
}
