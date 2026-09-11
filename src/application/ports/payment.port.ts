export interface CreatePaymentParams {
   amount: number;
   buyOrder: string;
   returnUrl: string;
   sessionId: string;
}

export interface CreatePaymentResult {
   token: string;
   url: string;
}

export interface CommitPaymentResult {
   amount: number;
   authorizationCode: string | null;
   buyOrder: string;
   responseCode: number;
   sessionId: string;
   status: string;
}

export abstract class PaymentPort {
   abstract create(params: CreatePaymentParams): Promise<CreatePaymentResult>;
   abstract commit(token: string): Promise<CommitPaymentResult>;
}
