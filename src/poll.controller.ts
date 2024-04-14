import { Controller, Get, Res, HttpStatus, Inject } from '@nestjs/common';
import { DataService } from './data.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * Controller responsible for handling polling requests.
 */
@Controller()
export class PollController {
  /**
   * Injects the DataService and ConfigService to be used for fetching data and reading configuration.
   * @param dataService The data service for retrieving data.
   * @param configService The configuration service for accessing environment variables.
   */
  constructor(
    private readonly dataService: DataService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  /**
   * Handles GET requests to the 'poll' endpoint. It attempts to fetch data within a configurable timeout window.
   * If data is not available within this time, it responds with a 'No new data' message.
   * @param res The injected response object from Express.
   * @returns A Promise that resolves to an Express Response object.
   */
  @Get('poll')
  async poll(@Res() res: Response): Promise<Response> {
    const timeout: number = this.configService.get<number>(
      'REQUEST_TIMEOUT',
      30000,
    );
    const startTime: number = Date.now();
    let data: { data?: any } = await this.dataService.getData();

    while (!data.data && Date.now() - startTime < timeout) {
      // Configurable timeout
      data = await this.dataService.getData();
    }

    if (!data.data) {
      return res.status(HttpStatus.OK).json({ status: 'No new data' });
    }

    return res.status(HttpStatus.OK).json(data);
  }
}
