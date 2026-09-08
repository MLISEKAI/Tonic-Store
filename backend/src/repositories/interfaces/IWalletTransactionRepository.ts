import { WalletTransaction } from '@prisma/client';

export interface IWalletTransactionRepository {
  create(data: {
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
  }): Promise<WalletTransaction>;
  findByWalletId(walletId: number, skip?: number, take?: number): Promise<WalletTransaction[]>;
  findByUserId(userId: number, skip?: number, take?: number): Promise<WalletTransaction[]>;
  findByIdempotencyKey(key: string): Promise<WalletTransaction | null>;
  findById(id: number): Promise<WalletTransaction | null>;
}
