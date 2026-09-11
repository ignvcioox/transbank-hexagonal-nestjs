import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { CommitPaymentUseCase } from '@application/use-cases/commit-payment.use-case';
import { CreatePaymentUseCase } from '@application/use-cases/create-payment.use-case';

import { CreatePaymentDto } from '@infrastructure/adapters/inbound/http/dto/create-payment.dto';
import {
   PaymentResultDetails,
   PaymentResultStatus,
} from '@infrastructure/adapters/inbound/http/types/payment-result.type';

@Controller('payments')
export class PaymentController {
   constructor(
      private readonly createPaymentUseCase: CreatePaymentUseCase,
      private readonly commitPaymentUseCase: CommitPaymentUseCase,
      private readonly configService: ConfigService,
   ) {}

   @Post()
   async create(@Body() { amount }: CreatePaymentDto) {
      const appUrl = this.configService.getOrThrow<string>('APP_URL');
      return this.createPaymentUseCase.execute({
         buyOrder: `order-${Date.now()}`,
         sessionId: `session-${Date.now()}`,
         amount,
         returnUrl: `${appUrl}/payments/commit`,
      });
   }

   @Get('commit')
   async commit(
      @Query('token_ws') token: string | undefined,
      @Query('TBK_TOKEN') abortedToken: string | undefined,
      @Res() response: Response,
   ) {
      // Webpay returns TBK_TOKEN instead of token_ws when the payment is aborted
      if (abortedToken) {
         return this.redirectToResult(response, 'ABORTED');
      }

      if (!token) {
         return this.redirectToResult(response, 'FAILED');
      }

      const { approved, amount, buyOrder, authorizationCode } =
         await this.commitPaymentUseCase.execute(token);

      const status: PaymentResultStatus = approved ? 'APPROVED' : 'REJECTED';

      return this.redirectToResult(response, status, {
         amount,
         buyOrder,
         authorizationCode,
      });
   }

   @Post('commit')
   failedCommit(@Res() response: Response) {
      return this.redirectToResult(response, 'FAILED');
   }

   private redirectToResult(
      response: Response,
      status: PaymentResultStatus,
      payment?: PaymentResultDetails,
   ) {
      const params = new URLSearchParams({ status });

      if (payment) {
         params.set('amount', String(payment.amount));
         params.set('buyOrder', payment.buyOrder);
         params.set('authorizationCode', payment.authorizationCode ?? '');
      }

      return response.redirect(`/result.html?${params.toString()}`);
   }
}
