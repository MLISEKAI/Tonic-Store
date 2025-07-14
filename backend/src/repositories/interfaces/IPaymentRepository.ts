import { Payment, PaymentMethod } from '@prisma/client';

export interface IPaymentRepository {
  getAllPayments(): Promise<Payment[]>;
  createPayment(orderId: number, method: PaymentMethod, amount: number): Promise<Payment>;
} 