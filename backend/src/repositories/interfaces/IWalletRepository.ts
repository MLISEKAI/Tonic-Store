import { Wallet } from '@prisma/client';

export interface IWalletRepository {
  findByUserId(userId: number): Promise<Wallet | null>;
  create(userId: number): Promise<Wallet>;
  updateBalance(walletId: number, balance: number): Promise<Wallet>;
  lockWallet(userId: number): Promise<Wallet | null>;
}
