import { Type } from '../../util/type';

/**
 * Execute request payload
 */
export interface ExecuteRequest {
  userId: string;
  questionId: string;
  type: Type;
  code: string;
}
