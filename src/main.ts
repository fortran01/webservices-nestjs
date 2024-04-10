import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { rawBodyMiddleware } from './rawBody.middleware';

/**
 * Bootstraps the application.
 * This function initializes the NestJS application with the AppModule,
 * sets a global prefix for the API routes, listens on a specified port,
 * and applies the RawBodyMiddleware globally.
 */
async function bootstrap(): Promise<void> {
  // Create a new NestJS application instance
  const app: INestApplication = await NestFactory.create(AppModule);

  // Apply the RawBodyMiddleware to webhooks
  app.use('/api/webhook', rawBodyMiddleware());

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Listen on port 3000 for incoming connections
  await app.listen(3000);

  // Log the URL where the application is running
  console.log(`Application is running on: http://localhost:3000`);
}

// Execute the bootstrap function to start the application
bootstrap();
