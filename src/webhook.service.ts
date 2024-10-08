import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';

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
   * @param configService The configuration service to access environment variables.
   * @param eventsGateway The gateway for emitting WebSocket events.
   */
  constructor(
    private configService: ConfigService,
    private eventsGateway: EventsGateway,
  ) {
    this.stripeClient = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') || '',
      {
        apiVersion: '2024-06-20',
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
  processEvent(rawBody: Buffer | undefined, signature: string): Stripe.Event {
    if (rawBody === undefined) {
      throw new Error('Raw body is undefined');
    }
    try {
      return this.stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        this.endpointSecret,
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Webhook Error: ${err.message}`);
        throw err;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  /**
   * Handles successful payment intents from Stripe.
   *
   * @param event The Stripe event object indicating a successful payment intent.
   */
  handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): void {
    this.eventsGateway.emitChargeStatus({
      status: 'succeeded',
      payment_intent: paymentIntent,
      timestamp: new Date().toISOString(),
    });
    console.log('Payment intent succeeded:', paymentIntent.id);
  }

  /**
   * Handles refunded charges from Stripe.
   *
   * @param event The Stripe event object indicating a refunded charge.
   */
  handleChargeRefunded(refund: Stripe.Refund): void {
    this.eventsGateway.emitChargeStatus({
      status: 'refunded',
      refund: refund,
      timestamp: new Date().toISOString(),
    });
    console.log('Charge refunded:', refund.id);
  }

  /**
   * Handles successful charge events from Stripe.
   *
   * @param event The Stripe event object indicating a successful charge.
   */
  handleChargeSucceeded(charge: Stripe.Charge): void {
    this.eventsGateway.emitChargeStatus({
      status: 'succeeded',
      charge: charge,
      timestamp: new Date().toISOString(),
    });
    console.log('Charge succeeded:', charge.id);
  }
}
