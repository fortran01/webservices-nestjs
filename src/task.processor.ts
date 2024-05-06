import { Process, Processor } from '@nestjs/bull';
import { EventsGateway } from './events.gateway';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

/**
 * Processor class for handling GitHub data fetching and processing.
 */
@Processor('github')
@Injectable()
export class TaskProcessor {
  /**
   * Constructs a new instance of TaskProcessor.
   * @param eventsGateway The gateway for emitting events to WebSocket clients.
   * @param httpService The HTTP service for making requests.
   */
  constructor(
    private eventsGateway: EventsGateway,
    private httpService: HttpService,
  ) {}

  /**
   * Processes the 'fetchData' job from the GitHub queue.
   * Fetches data from GitHub and emits the processed data via WebSocket.
   * @returns A promise that resolves to the fetched and processed GitHub data.
   */
  @Process('fetchData')
  async handleGithubData(): Promise<{ name: string; stars: number }[]> {
    const url =
      'https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=100';
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }),
    );
    const repositories = response.data.items;

    // Simulate processing delay
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));

    const processedData = repositories.map(
      (repo: { name: string; stargazers_count: number }) => ({
        name: repo.name,
        stars: repo.stargazers_count,
      }),
    );

    // Emit processed data via WebSocket
    this.eventsGateway.server.emit('data_processed', { data: processedData });
    this.eventsGateway.server.emit('task_completed', {
      message: 'Data processing completed',
    });

    return processedData;
  }
}
