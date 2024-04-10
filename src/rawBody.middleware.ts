import { Response } from 'express';
import { json } from 'body-parser';
import { RequestWithRawBody } from './requestWithRawBody.interface';

/**
 * Middleware to capture and attach the raw body of a request to the request object.
 */
export function rawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      if (Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
