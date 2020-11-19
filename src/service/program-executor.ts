import { ProgramCommand } from './program-command';
import { ExecutionResponse } from '../dto/response/execution-response';

export class ProgramExecutor {
  private programCommand: ProgramCommand = {} as ProgramCommand

  public setCommand(programCommand: ProgramCommand): void {
    this.programCommand = programCommand;
  }

  public run(code: string): Promise<ExecutionResponse> {
    return this.programCommand.execute(code);
  }
}
