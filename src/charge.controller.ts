// charge.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChargeService } from './charge.service';

/**
 * Controller to handle requests related to charges.
 */
@Controller()
export class ChargeController {
  /**
   * Constructs a new instance of the ChargeController.
   * @param chargeService The service to handle charge operations.
   */
  constructor(private readonly chargeService: ChargeService) {}

  /**
   * Returns a simple greeting message.
   * @returns The greeting message.
   */
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Creates a charge based on the provided request body.
   * @param chargeRequest The request body containing the token, amount, and currency.
   * @returns The created charge's ID, latency, and status.
   */
  @Post('create_charge')
  async createCharge(
    @Body() chargeRequest: { token: string; amount: number; currency: string },
  ): Promise<{ id: string; latency: number; status: HttpStatus }> {
    try {
      const { charge, latency } = await this.chargeService.createCharge(
        chargeRequest.token,
        chargeRequest.amount,
        chargeRequest.currency,
      );
      return { id: charge.id, latency, status: HttpStatus.OK };
    } catch (error: any) {
      if (error.status && error.response) {
        throw new HttpException(error.response, error.status);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
