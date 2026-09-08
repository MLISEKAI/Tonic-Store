import { WithdrawalRequest } from '@prisma/client';

export interface IWithdrawalRequestRepository {
  create(data: {
    userId: number;
    walletId: number;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    note?: string;
  }): Promise<WithdrawalRequest>;
  findById(id: number): Promise<WithdrawalRequest | null>;
  findByUserId(userId: number): Promise<WithdrawalRequest[]>;
  findByWalletId(walletId: number): Promise<WithdrawalRequest[]>;
  findPending(): Promise<WithdrawalRequest[]>;
  updateStatus(id: number, status: any, processedBy?: number): Promise<WithdrawalRequest>;
}
