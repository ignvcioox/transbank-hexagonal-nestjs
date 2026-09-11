import { Module } from '@nestjs/common';

import { PaymentPort } from '@application/ports/payment.port';
import { CommitPaymentUseCase } from '@application/use-cases/commit-payment.use-case';
import { CreatePaymentUseCase } from '@application/use-cases/create-payment.use-case';

import { PaymentController } from '@infrastructure/adapters/inbound/http/payment.controller';
import { TransbankAdapter } from '@infrastructure/adapters/outbound/transbank/transbank.adapter';

@Module({
   controllers: [PaymentController],
   providers: [
      { provide: PaymentPort, useClass: TransbankAdapter },
      {
         provide: CreatePaymentUseCase,
         useFactory: (paymentPort: PaymentPort) => new CreatePaymentUseCase(paymentPort),
         inject: [PaymentPort],
      },
      {
         provide: CommitPaymentUseCase,
         useFactory: (paymentPort: PaymentPort) => new CommitPaymentUseCase(paymentPort),
         inject: [PaymentPort],
      },
   ],
})
export class AdaptersModule {}
