import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  /**
   * Endpoint for server-sent events.
   * @returns An Observable that emits MessageEvent objects.
   */
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.sseService.getEventStream();
  }
}
