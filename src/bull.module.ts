import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

/**
 * QueueModule is a NestJS module that sets up the Bull queue with Redis configuration.
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'github',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  exports: [BullModule], // This exports BullModule along with all defined queues
})
export class QueueModule {}
