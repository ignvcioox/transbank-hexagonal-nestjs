export type PaymentResultStatus = 'APPROVED' | 'REJECTED' | 'ABORTED' | 'FAILED';

export interface PaymentResultDetails {
   amount: number;
   authorizationCode: string | null;
   buyOrder: string;
}
