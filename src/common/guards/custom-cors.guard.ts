import { Injectable, NestMiddleware, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle CORS (Cross-Origin Resource Sharing) for specific origins.
 */
@Injectable()
export class CustomCorsGuard implements NestMiddleware {
  /**
   * Middleware function to set CORS headers based on the request origin.
   *
   * @param {Request} req - The incoming HTTP request object.
   * @param {Response} res - The outgoing HTTP response object.
   * @param {NextFunction} next - The next middleware function in the pipeline.
   */
  use(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): void {
    const allowedOrigins: string[] = ['http://localhost:5000'];
    const origin: string | undefined = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, DELETE');
      res.header(
        'Access-Control-Allow-Headers',
        'Timezone-Offset, Sample-Source',
      );
      res.header('Access-Control-Expose-Headers', 'X-Powered-By');
      res.header('Access-Control-Max-Age', '120');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  }
}
