import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { Job } from 'bull';

/**
 * Controller for GitHub task related endpoints.
 */
@Controller('fetch-github-data')
export class TaskController {
  /**
   * Constructs a new instance of TaskController.
   * @param taskService The service handling GitHub data fetching.
   */
  constructor(private readonly taskService: TaskService) {}

  /**
   * Endpoint to trigger fetching of GitHub data.
   * @returns An object containing the job ID and the status of the fetch operation.
   */
  @Get()
  async fetchData(): Promise<{ jobId: string | number; status: string }> {
    const job: Job = await this.taskService.fetchGithubData();
    return { jobId: job.id, status: 'Fetching GitHub data' };
  }
}
