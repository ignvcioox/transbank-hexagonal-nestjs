import { PaymentPort } from '@application/ports/payment.port';

export interface CommitPaymentOutput {
   amount: number;
   approved: boolean;
   authorizationCode: string | null;
   buyOrder: string;
   responseCode: number;
   sessionId: string;
   status: string;
}

export class CommitPaymentUseCase {
   constructor(private readonly paymentPort: PaymentPort) {}

   async execute(token: string): Promise<CommitPaymentOutput> {
      const { status, amount, buyOrder, sessionId, authorizationCode, responseCode } =
         await this.paymentPort.commit(token);

      const approved = status === 'AUTHORIZED' && responseCode === 0;

      return {
         approved,
         status,
         amount,
         buyOrder,
         sessionId,
         authorizationCode,
         responseCode,
      };
   }
}
