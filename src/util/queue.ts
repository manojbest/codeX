import BetterQueue, { Ticket } from 'better-queue';
import { Logger } from './logger';
import { v4 } from 'uuid';

/**
 * Async task signature
 */
type AsyncTask = (
  params?: any
) => {
  error?: any;
  result?: any;
};

/**
 * Generic queue to process async tasks
 */
export class Queue {
  private betterQueue: BetterQueue;

  /**
   * Param constructor to initialize the queue with async task
   * @param asyncTask
   */
  constructor(asyncTask: AsyncTask) {
    this.betterQueue = new BetterQueue(
      (task, cb) => {
        Logger.info('Queue task : ', task);
        // trigger async task
        const { error, result } = asyncTask(task);
        cb(error, result);
      },
      {
        batchDelay: 5000, // delay before starting to popping items off the queue
        batchDelayTimeout: 1000, // wait for a new task to arrive before firing off the batch
      }
    );
  }

  /**
   * Push method to inset task into the queue
   *
   * @param payload - the task payload
   */
  public push(payload: any): Ticket {
    return this.betterQueue.push({ id: v4(), payload });
  }
}
