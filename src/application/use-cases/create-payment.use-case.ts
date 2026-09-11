import {
   CreatePaymentParams,
   CreatePaymentResult,
   PaymentPort,
} from '@application/ports/payment.port';

export class CreatePaymentUseCase {
   constructor(private readonly paymentPort: PaymentPort) {}

   async execute(params: CreatePaymentParams): Promise<CreatePaymentResult> {
      return this.paymentPort.create(params);
   }
}
