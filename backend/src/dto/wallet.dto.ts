export class WalletTransactionDto {
  id!: number;
  type!: string;
  status!: string;
  amount!: number;
  balanceBefore!: number;
  balanceAfter!: number;
  referenceType?: string;
  referenceId?: number;
  description?: string;
  createdAt!: Date;
}

export class WalletBalanceDto {
  balance!: number;
  currency!: string;
  totalDeposited!: number;
  totalWithdrawn!: number;
}

export class TopUpDto {
  amount!: number;
  description?: string;
  idempotencyKey?: string;
}

export class WithdrawDto {
  amount!: number;
  bankName!: string;
  accountNumber!: string;
  accountHolder!: string;
  note?: string;
}

export class WalletHistoryQueryDto {
  page!: number;
  limit!: number;
}
