import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  Body,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';
import Stripe from 'stripe';
import { RequestWithRawBody } from './requestWithRawBody.interface';

/**
 * Controller to handle webhook requests.
 */
@Controller('webhook')
export class WebhookController {
  /**
   * Initializes the webhook controller with the webhook service.
   * @param webhookService The service to process webhook events.
   */
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Handles incoming webhook events.
   * @param req The request object containing the raw body and headers.
   * @param res The response object to send replies.
   * @param body The parsed body of the request.
   * @param signature The Stripe signature header to verify requests.
   * @returns A promise that resolves with the response object.
   */
  @Post()
  async handleWebhook(
    @Req() req: RequestWithRawBody,
    @Res() res: Response,
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ): Promise<Response> {
    try {
      const event: Stripe.Event = this.webhookService.processEvent(
        req.rawBody,
        signature,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent: Stripe.PaymentIntent = event.data
            .object as Stripe.PaymentIntent;
          this.webhookService.handlePaymentSuccess(paymentIntent);
          break;
        case 'charge.refunded':
          const refund: Stripe.Refund = event.data
            .object as unknown as Stripe.Refund;
          this.webhookService.handleRefund(refund);
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }
    } catch (err: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    return res.status(HttpStatus.OK).send({ received: true });
  }
}
