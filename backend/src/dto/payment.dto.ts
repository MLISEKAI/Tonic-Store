export class PaymentDto {
  id!: number;
  orderId!: number;
  method!: string;
  status!: string;
  amount!: number;
  currency!: string;
  transactionId?: string;
  paymentDate?: Date;
  createdAt!: Date;
  updatedAt!: Date;
} 