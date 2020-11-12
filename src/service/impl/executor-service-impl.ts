import { ExecutorService } from '../contract/executor-service';
import { ExecuteRequest } from '../../dto/request/execute-request';
import { ExecuteResponse } from '../../dto/response/execute-response';
import { ExecutorFactory } from '../../factory/executor-factory';
import { Status } from '../../util/status';
import { Logger } from '../../util/logger';

export class ExecutorServiceImpl implements ExecutorService {
  private executorFactory: ExecutorFactory;

  constructor() {
    this.executorFactory = new ExecutorFactory();
  }

  execute(request: ExecuteRequest): ExecuteResponse {
    // get proper executor for given type
    const executor = this.executorFactory.getExecutor(request.type);
    // check executor
    if (!executor) {
      Logger.error('invalid executor found : ', request.type);
      // wrong executor type given, so the result will be `ERROR`
      return { log: '', status: Status.ERROR };
    }
    // TODO - depending on the question, the input and output values should be passed into the executor
    // do the program execution
    return executor.execute(request.code, [], []);
  }
}
