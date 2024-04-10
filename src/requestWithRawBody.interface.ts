import { Request } from 'express';

/**
 * Interface extending the Express Request to include rawBody.
 * @extends {Request} Express Request object.
 */
export interface RequestWithRawBody extends Request {
  /**
   * The raw body of the HTTP request as a Buffer.
   * @type {Buffer}
   */
  rawBody: Buffer;
}
