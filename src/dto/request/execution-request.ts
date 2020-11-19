import { Type } from '../../util/type';

/**
 * Execute request payload
 */
export interface ExecutionRequest {
  userId: string;
  questionId: string;
  type: Type;
  code: string;
}
