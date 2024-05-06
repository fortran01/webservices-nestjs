import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { join } from 'path';
import { ChargeService } from './charge.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PollController } from './poll.controller';
import { DataService } from './data.service';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { EventsGateway } from './events.gateway';
import { PostsController } from './posts.controller';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskProcessor } from './task.processor';
import { QueueModule } from './bull.module';

/**
 * The AppModule class is the root module of the application.
 * It imports necessary modules such as ConfigModule for configuration management,
 * ServeStaticModule for serving static files, HttpModule for HTTP requests, and
 * it now includes the SseController and SseService for server-sent events functionality.
 * It also declares the controllers and providers that are used in the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}` as string,
      isGlobal: true,
    } as ConfigModuleOptions),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client') as string,
      exclude: ['/api*'],
    } as ServeStaticModuleOptions),
    HttpModule,
    QueueModule,
  ],
  controllers: [
    ChargeController,
    WebhookController,
    PollController,
    SseController,
    PostsController,
    TaskController,
  ],
  providers: [
    ChargeService,
    WebhookService,
    DataService,
    SseService,
    EventsGateway,
    TaskService,
    TaskProcessor,
  ],
})
export class AppModule {}
