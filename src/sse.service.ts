import { Injectable } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageEvent } from '@nestjs/common';

/**
 * Service responsible for providing server-sent events.
 */
@Injectable()
export class SseService {
  /**
   * Creates an Observable stream that emits MessageEvent objects every second.
   * @returns An Observable emitting MessageEvent objects containing a stringified JSON object with a count value.
   */
  getEventStream(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count: number): MessageEvent => {
        const event = new MessageEvent('message', {
          data: JSON.stringify({ count }),
        });
        return event;
      }),
    );
  }
}
