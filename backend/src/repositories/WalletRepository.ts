import { Wallet, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { IWalletRepository } from './interfaces/IWalletRepository';

export class WalletRepository implements IWalletRepository {
  async findByUserId(userId: number): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async create(userId: number): Promise<Wallet> {
    return prisma.wallet.create({
      data: {
        userId,
        balance: '0',
        totalDeposited: '0',
        totalWithdrawn: '0',
        currency: 'VND',
      } as unknown as Prisma.WalletCreateInput,
    });
  }

  async updateBalance(walletId: number, balance: number): Promise<Wallet> {
    return prisma.wallet.update({
      where: { id: walletId },
      data: { balance: String(balance) } as Prisma.WalletUpdateInput,
    });
  }

  async lockWallet(userId: number): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: { userId },
    });
  }
}
