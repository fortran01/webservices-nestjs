import { Injectable } from '@nestjs/common';

/**
 * Interface representing the structure of the data returned by getData method.
 */
interface DataResponse {
  data?: string;
  elapsed_time?: number;
  processing_start?: string;
  processing_end?: string;
}

@Injectable()
export class DataService {
  /**
   * Fetches data with a simulated delay and returns information about the process.
   * @returns A promise that resolves to an object containing the data and metadata about the fetching process.
   */
  getData(): Promise<DataResponse> {
    return new Promise((resolve) => {
      // Random wait time between 5 and 10 seconds
      const waitTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% chance to return data
          const processingStart = new Date();
          const processingEnd = new Date();
          processingEnd.setSeconds(processingEnd.getSeconds() + waitTime);
          resolve({
            data: 'Sample data',
            elapsed_time: waitTime,
            processing_start: processingStart.toISOString(),
            processing_end: processingEnd.toISOString(),
          });
        } else {
          resolve({});
        }
      }, waitTime * 1000);
    });
  }
}
