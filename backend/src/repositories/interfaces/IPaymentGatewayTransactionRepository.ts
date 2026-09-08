import { PaymentGatewayTransaction } from '@prisma/client';

export interface IPaymentGatewayTransactionRepository {
  create(data: {
    walletId: number;
    userId: number;
    gateway: any;
    amount: number;
    description?: string;
    metadata?: any;
    idempotencyKey?: string;
  }): Promise<PaymentGatewayTransaction>;
  findById(id: number): Promise<PaymentGatewayTransaction | null>;
  findByGatewayTransactionId(gatewayTransactionId: string): Promise<PaymentGatewayTransaction | null>;
  findByIdempotencyKey(key: string): Promise<PaymentGatewayTransaction | null>;
  findByUserId(userId: number): Promise<PaymentGatewayTransaction[]>;
  findByWalletId(walletId: number): Promise<PaymentGatewayTransaction[]>;
  updateStatus(id: number, status: any, gatewayTransactionId?: string, processedAt?: Date): Promise<PaymentGatewayTransaction>;
  updateResponse(id: number, response: any): Promise<PaymentGatewayTransaction>;
}
