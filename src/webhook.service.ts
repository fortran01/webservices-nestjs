import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

/**
 * Service responsible for handling webhook events from Stripe.
 */
@Injectable()
export class WebhookService {
  /**
   * The Stripe client used for interacting with the Stripe API.
   */
  private readonly stripeClient: Stripe;

  /**
   * The secret used to verify the webhook signature.
   */
  private readonly endpointSecret: string;

  /**
   * Initializes the Stripe client with the API key from the ConfigService.
   */
  constructor(private configService: ConfigService) {
    this.stripeClient = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2023-10-16',
      },
    );
    this.endpointSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }

  /**
   * Processes incoming webhook events from Stripe.
   *
   * @param rawBody The raw body of the incoming request, used to construct the event.
   * @param signature The signature of the incoming request, used for verification.
   * @returns The event object constructed from the raw body and signature.
   * @throws Throws an error if the event cannot be verified or constructed.
   */
  processEvent(rawBody: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        this.endpointSecret,
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Handles successful payment intents from Stripe.
   *
   * @param paymentIntent The payment intent object from Stripe indicating a successful payment.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): void {
    console.log('Payment was successful.');
    // Logic to handle successful payment
  }

  /**
   * Handles refunds processed by Stripe.
   *
   * @param refund The refund object from Stripe indicating a processed refund.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRefund(refund: Stripe.Refund): void {
    console.log('Refund processed.');
    // Logic to handle refund
  }
}
