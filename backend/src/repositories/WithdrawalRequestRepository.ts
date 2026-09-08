import { WithdrawalRequest, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { IWithdrawalRequestRepository } from './interfaces/IWithdrawalRequestRepository';

export class WithdrawalRequestRepository implements IWithdrawalRequestRepository {
  async create(data: {
    userId: number;
    walletId: number;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    note?: string;
  }): Promise<WithdrawalRequest> {
    return prisma.withdrawalRequest.create({
      data: {
        userId: data.userId,
        walletId: data.walletId,
        amount: String(data.amount),
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
        note: data.note,
        status: 'PENDING',
      } as unknown as Prisma.WithdrawalRequestCreateInput,
    });
  }

  async findById(id: number): Promise<WithdrawalRequest | null> {
    return prisma.withdrawalRequest.findUnique({
      where: { id },
      include: {
        user: true,
        processor: true,
      },
    });
  }

  async findByUserId(userId: number): Promise<WithdrawalRequest[]> {
    return prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByWalletId(walletId: number): Promise<WithdrawalRequest[]> {
    return prisma.withdrawalRequest.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(): Promise<WithdrawalRequest[]> {
    return prisma.withdrawalRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  async updateStatus(id: number, status: any, processedBy?: number): Promise<WithdrawalRequest> {
    return prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status,
        processedBy,
        processedAt: status === 'APPROVED' || status === 'REJECTED' || status === 'COMPLETED' ? new Date() : undefined,
      } as Prisma.WithdrawalRequestUpdateInput,
    });
  }
}
