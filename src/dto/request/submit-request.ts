import { ExecutionRequest } from './execution-request';

/**
 * Submit request payload
 */
export interface SubmitRequest extends ExecutionRequest {
  socketId: string;
}
