import { Type } from '../util/type';
import { Executor } from '../executor/executor';
import { JavaExecutor } from '../executor/java-executor';
import { NodeExecutor } from '../executor/node-executor';
import { PythonExecutor } from '../executor/python-executor';

/**
 * Factory for executors
 */
export class ExecutorFactory {
  /**
   * Get executor for given type
   *
   * @param type - the type
   */
  getExecutor(type: Type): Executor | null {
    switch (type) {
      case Type.JAVA:
        return new JavaExecutor();
      case Type.NODE:
        return new NodeExecutor();
      case Type.PYTHON:
        return new PythonExecutor();
      default:
        return null;
    }
  }
}
