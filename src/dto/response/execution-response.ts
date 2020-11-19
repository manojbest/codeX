import { Status } from '../../util/status';

/**
 * Execute response payload
 */
export interface ExecutionResponse {
  log: string;
  status: Status;
}
