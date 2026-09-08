import { PaymentGatewayTransaction, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { IPaymentGatewayTransactionRepository } from './interfaces/IPaymentGatewayTransactionRepository';

export class PaymentGatewayTransactionRepository implements IPaymentGatewayTransactionRepository {
  async create(data: {
    walletId: number;
    userId: number;
    gateway: any;
    amount: number;
    description?: string;
    metadata?: any;
    idempotencyKey?: string;
  }): Promise<PaymentGatewayTransaction> {
    return prisma.paymentGatewayTransaction.create({
      data: {
        walletId: data.walletId,
        userId: data.userId,
        gateway: data.gateway,
        amount: String(data.amount),
        description: data.description,
        metadata: data.metadata as Prisma.InputJsonValue,
        idempotencyKey: data.idempotencyKey,
      } as unknown as Prisma.PaymentGatewayTransactionCreateInput,
    });
  }

  async findById(id: number): Promise<PaymentGatewayTransaction | null> {
    return prisma.paymentGatewayTransaction.findUnique({ where: { id } });
  }

  async findByGatewayTransactionId(gatewayTransactionId: string): Promise<PaymentGatewayTransaction | null> {
    return prisma.paymentGatewayTransaction.findUnique({ where: { gatewayTransactionId } });
  }

  async findByIdempotencyKey(key: string): Promise<PaymentGatewayTransaction | null> {
    return prisma.paymentGatewayTransaction.findUnique({ where: { idempotencyKey: key } });
  }

  async findByUserId(userId: number): Promise<PaymentGatewayTransaction[]> {
    return prisma.paymentGatewayTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByWalletId(walletId: number): Promise<PaymentGatewayTransaction[]> {
    return prisma.paymentGatewayTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: any, gatewayTransactionId?: string, processedAt?: Date): Promise<PaymentGatewayTransaction> {
    return prisma.paymentGatewayTransaction.update({
      where: { id },
      data: {
        status,
        gatewayTransactionId,
        processedAt,
      } as Prisma.PaymentGatewayTransactionUpdateInput,
    });
  }

  async updateResponse(id: number, response: any): Promise<PaymentGatewayTransaction> {
    return prisma.paymentGatewayTransaction.update({
      where: { id },
      data: {
        gatewayResponse: response as Prisma.InputJsonValue,
      } as Prisma.PaymentGatewayTransactionUpdateInput,
    });
  }
}
