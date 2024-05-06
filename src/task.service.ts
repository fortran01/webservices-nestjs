import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';

/**
 * Service class for interacting with the task queue.
 */
@Injectable()
export class TaskService {
  /**
   * Constructs a new instance of TaskService.
   * @param taskQueue The injected Bull queue specific for task operations.
   */
  constructor(@InjectQueue('github') private taskQueue: Queue<any>) {}

  /**
   * Adds a job to the task queue to fetch GitHub data.
   * @returns A Promise representing the completion of the job addition.
   */
  async fetchGithubData(): Promise<any> {
    return await this.taskQueue.add('fetchData');
  }
}
