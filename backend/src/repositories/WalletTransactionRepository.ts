import { WalletTransaction, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { IWalletTransactionRepository } from './interfaces/IWalletTransactionRepository';

export class WalletTransactionRepository implements IWalletTransactionRepository {
  async create(data: {
    walletId: number;
    userId: number;
    type: any;
    status: any;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    referenceType?: string;
    referenceId?: number;
    description?: string;
    metadata?: any;
    idempotencyKey?: string;
  }): Promise<WalletTransaction> {
    return prisma.walletTransaction.create({
      data: {
        walletId: data.walletId,
        userId: data.userId,
        type: data.type,
        status: data.status,
        amount: String(data.amount),
        balanceBefore: String(data.balanceBefore),
        balanceAfter: String(data.balanceAfter),
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        description: data.description,
        metadata: data.metadata as Prisma.InputJsonValue,
        idempotencyKey: data.idempotencyKey,
      } as unknown as Prisma.WalletTransactionCreateInput,
    });
  }

  async findByWalletId(walletId: number, skip: number = 0, take: number = 50): Promise<WalletTransaction[]> {
    return prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findByUserId(userId: number, skip: number = 0, take: number = 50): Promise<WalletTransaction[]> {
    return prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findByIdempotencyKey(key: string): Promise<WalletTransaction | null> {
    return prisma.walletTransaction.findUnique({
      where: { idempotencyKey: key },
    });
  }

  async findById(id: number): Promise<WalletTransaction | null> {
    return prisma.walletTransaction.findUnique({
      where: { id },
    });
  }
}
