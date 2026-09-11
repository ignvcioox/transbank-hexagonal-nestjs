import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
   Environment,
   IntegrationApiKeys,
   IntegrationCommerceCodes,
   Options,
   WebpayPlus,
} from 'transbank-sdk';

import {
   CommitPaymentResult,
   CreatePaymentParams,
   CreatePaymentResult,
   PaymentPort,
} from '@application/ports/payment.port';
import { EnvironmentVariables } from '@config/environments';

@Injectable()
export class TransbankAdapter implements PaymentPort {
   private readonly transaction: InstanceType<typeof WebpayPlus.Transaction>;

   constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
      const environment = this.configService.get('TRANSBANK_ENVIRONMENT', { infer: true });
      const isProduction = environment === 'production';

      const commerceCode = isProduction
         ? this.configService.getOrThrow<string>('TRANSBANK_COMMERCE_CODE', { infer: true })
         : IntegrationCommerceCodes.WEBPAY_PLUS;

      const apiKey = isProduction
         ? this.configService.getOrThrow<string>('TRANSBANK_API_KEY', { infer: true })
         : IntegrationApiKeys.WEBPAY;

      this.transaction = new WebpayPlus.Transaction(
         new Options(
            commerceCode,
            apiKey,
            isProduction ? Environment.Production : Environment.Integration,
         ),
      );
   }

   async create(params: CreatePaymentParams): Promise<CreatePaymentResult> {
      const response = await this.transaction.create(
         params.buyOrder,
         params.sessionId,
         params.amount,
         params.returnUrl,
      );

      return {
         token: response.token,
         url: response.url,
      };
   }

   async commit(token: string): Promise<CommitPaymentResult> {
      const response = await this.transaction.commit(token);

      return {
         status: response.status,
         amount: response.amount,
         buyOrder: response.buy_order,
         sessionId: response.session_id,
         authorizationCode: response.authorization_code,
         responseCode: response.response_code,
      };
   }
}
