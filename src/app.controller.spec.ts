import { Test, TestingModule } from '@nestjs/testing';
import { ChargeController } from './charge.controller';
import { WebhookController } from './webhook.controller';
import { ChargeService } from './charge.service';
import { WebhookService } from './webhook.service';

describe('Controllers', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ChargeController, WebhookController],
      providers: [ChargeService, WebhookService],
    }).compile();
  });

  // Example test for ChargeController
  describe('ChargeController', () => {
    it('should be defined', () => {
      const controller: ChargeController =
        module.get<ChargeController>(ChargeController);
      expect(controller).toBeDefined();
    });
  });

  // Example test for WebhookController
  describe('WebhookController', () => {
    it('should be defined', () => {
      const controller: WebhookController =
        module.get<WebhookController>(WebhookController);
      expect(controller).toBeDefined();
    });
  });
});
