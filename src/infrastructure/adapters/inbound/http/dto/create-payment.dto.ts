import { IsInt, IsPositive } from 'class-validator';

export class CreatePaymentDto {
   @IsInt()
   @IsPositive()
   amount: number;
}
