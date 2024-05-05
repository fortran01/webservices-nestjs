import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

/**
 * Bootstraps the application.
 * This function initializes the NestJS application with the AppModule,
 * sets a global prefix for the API routes, listens on a specified port.
 */
async function bootstrap(): Promise<void> {
  // Create a new NestJS application instance with rawBody enabled
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Setup CORS with specific options
  app.use(
    cors({
      origin: 'http://localhost:5000',
      credentials: true,
      methods: 'GET, DELETE',
      allowedHeaders: 'Timezone-Offset, Sample-Source',
      exposedHeaders: 'X-Powered-By',
      maxAge: 120,
    }),
  );

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Listen on port 3000 for incoming connections
  await app.listen(3000);

  // Log the URL where the application is running
  console.log(`Application is running on: http://localhost:3000`);
}

// Execute the bootstrap function to start the application
bootstrap();
