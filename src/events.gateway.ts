import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

/**
 * Gateway to handle WebSocket events.
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  /**
   * WebSocket server instance.
   */
  @WebSocketServer()
  server!: Server;

  /**
   * Emits a charge status event through the WebSocket server.
   * @param data The data to be emitted with the charge status event.
   */
  emitChargeStatus(data: Record<string, unknown>): void {
    this.server.emit('charge_status', data);
  }

  /**
   * Handles incoming events on the 'events' channel.
   * @param data The data received with the event.
   */
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): void {
    console.log(data);
  }
}
