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

/**
 * The AppModule class is the root module of the application.
 * It imports necessary modules such as ConfigModule for configuration management,
 * ServeStaticModule for serving static files, and HttpModule for HTTP requests.
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
  ],
  controllers: [ChargeController, WebhookController],
  providers: [ChargeService, WebhookService],
})
export class AppModule {}
