import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Charge } from './charge.model';

/**
 * Service to handle charges with Stripe API.
 */
@Injectable()
export class ChargeService {
  /**
   * Stripe API key used for authentication.
   */
  private readonly stripeApiKey: string;

  /**
   * Constructs the ChargeService.
   * @param httpService The HTTP service for making requests.
   * @param configService The configuration service for accessing environment variables.
   */
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.stripeApiKey = this.configService.get<string>('STRIPE_API_KEY') || '';
  }

  /**
   * Creates a charge using the Stripe API.
   * @param token The payment source token.
   * @param amount The amount to be charged.
   * @param currency The currency of the charge.
   * @returns A promise that resolves with the charge details and latency.
   */
  async createCharge(
    token: string,
    amount: number,
    currency: string,
  ): Promise<{ charge: Charge; latency: number }> {
    const start: number = Date.now();

    try {
      const response = await firstValueFrom(
        this.httpService.post<{
          id: string;
          amount: number;
          currency: string;
          status: string;
        }>(
          'https://api.stripe.com/v1/charges',
          `source=${token}&amount=${amount}&currency=${currency}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${this.stripeApiKey}`,
            },
            timeout: this.configService.get<number>('REQUEST_TIMEOUT'),
          },
        ),
      );

      const data = response.data;
      const charge: Charge = new Charge(
        data.id,
        data.amount,
        data.currency,
        data.status,
      );

      const latency: number = Date.now() - start;

      return { charge, latency };
    } catch (error: any) {
      // Check if the error has a response (HTTP error)
      if (error.response) {
        throw new HttpException(
          error.response.data.error.message || error.message,
          error.response.status,
        );
      } else {
        // For non-HTTP errors, you can throw a generic InternalServerErrorException
        // or handle them as needed
        throw new InternalServerErrorException(
          `Failed to create charge: ${error.message}`,
        );
      }
    }
  }
}
