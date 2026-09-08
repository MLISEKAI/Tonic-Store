import { prisma } from '../prisma';
import type { Request, Response } from 'express';
import { WalletRepository } from '../repositories/WalletRepository';
import { WalletTransactionRepository } from '../repositories/WalletTransactionRepository';
import { WithdrawalRequestRepository } from '../repositories/WithdrawalRequestRepository';
import {
  WalletTransactionType,
  WalletTransactionStatus,
  WithdrawalStatus,
  PaymentStatus,
  OrderStatus,
} from '@prisma/client';
import logger from '../config/logger';
import { SystemException, ValidationException } from '../common/exceptions/system-exception';
import { ErrorCode } from '../common/exceptions/error-codes';

const walletRepository = new WalletRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const withdrawalRequestRepository = new WithdrawalRequestRepository();

export const getOrCreateWallet = async (userId: number) => {
  let wallet = await walletRepository.findByUserId(userId);
  if (!wallet) {
    wallet = await walletRepository.create(userId);
    logger.info(`Wallet created for user ${userId}`);
  }
  return wallet;
};

export const getBalance = async (userId: number) => {
  const wallet = await getOrCreateWallet(userId);
  return {
    balance: parseFloat(wallet.balance.toString()),
    currency: wallet.currency,
    totalDeposited: parseFloat(wallet.totalDeposited.toString()),
    totalWithdrawn: parseFloat(wallet.totalWithdrawn.toString()),
  };
};

export const topUp = async (
  userId: number,
  amount: number,
  idempotencyKey?: string,
  description?: string
) => {
  if (amount <= 0) {
    throw new SystemException(ErrorCode.INVALID_VALUE, 'Amount must be greater than 0');
  }

  if (idempotencyKey) {
    const existing = await walletTransactionRepository.findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return {
        transaction: existing,
        message: 'Transaction already processed',
      };
    }
  }

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Wallet is inactive');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());
    const balanceAfter = balanceBefore + amount;
    const newTotalDeposited = parseFloat(wallet.totalDeposited.toString()) + amount;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
        totalDeposited: String(newTotalDeposited),
      },
    });

    const transaction = await walletTransactionRepository.create({
      walletId: wallet.id,
      userId,
      type: WalletTransactionType.DEPOSIT,
      status: WalletTransactionStatus.COMPLETED,
      amount,
      balanceBefore,
      balanceAfter,
      description: description || 'Nạp tiền vào ví',
      idempotencyKey,
    });

    logger.info(`Top-up successful: user=${userId}, amount=${amount}, balance=${balanceAfter}`);

    return {
      transaction,
      balance: balanceAfter,
    };
  });
};

export const deduct = async (
  userId: number,
  amount: number,
  type: WalletTransactionType,
  referenceType?: string,
  referenceId?: number,
  description?: string,
  idempotencyKey?: string
) => {
  if (amount <= 0) {
    throw new SystemException(ErrorCode.INVALID_VALUE, 'Amount must be greater than 0');
  }

  if (idempotencyKey) {
    const existing = await walletTransactionRepository.findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return {
        transaction: existing,
        message: 'Transaction already processed',
      };
    }
  }

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Wallet is inactive');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());

    if (balanceBefore < amount) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Insufficient balance');
    }

    const balanceAfter = balanceBefore - amount;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
      },
    });

    const transaction = await walletTransactionRepository.create({
      walletId: wallet.id,
      userId,
      type,
      status: WalletTransactionStatus.COMPLETED,
      amount: -amount,
      balanceBefore,
      balanceAfter,
      referenceType,
      referenceId,
      description: description || `Thanh toán ${amount} VND`,
      idempotencyKey,
    });

    logger.info(`Deduct successful: user=${userId}, amount=${amount}, balance=${balanceAfter}`);

    return {
      transaction,
      balance: balanceAfter,
    };
  });
};

export const refund = async (
  userId: number,
  amount: number,
  referenceType: string,
  referenceId: number,
  description?: string,
  idempotencyKey?: string
) => {
  if (amount <= 0) {
    throw new SystemException(ErrorCode.INVALID_VALUE, 'Refund amount must be greater than 0');
  }

  if (idempotencyKey) {
    const existing = await walletTransactionRepository.findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return {
        transaction: existing,
        message: 'Refund already processed',
      };
    }
  }

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());
    const balanceAfter = balanceBefore + amount;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
      },
    });

    const transaction = await walletTransactionRepository.create({
      walletId: wallet.id,
      userId,
      type: WalletTransactionType.REFUND,
      status: WalletTransactionStatus.COMPLETED,
      amount,
      balanceBefore,
      balanceAfter,
      referenceType,
      referenceId,
      description: description || `Hoàn tiền ${amount} VND`,
      idempotencyKey,
    });

    logger.info(`Refund successful: user=${userId}, amount=${amount}, balance=${balanceAfter}`);

    return {
      transaction,
      balance: balanceAfter,
    };
  });
};

export const withdraw = async (
  userId: number,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountHolder: string,
  note?: string
) => {
  if (amount <= 0) {
    throw new SystemException(ErrorCode.INVALID_VALUE, 'Withdrawal amount must be greater than 0');
  }

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Wallet is inactive');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());

    if (balanceBefore < amount) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Insufficient balance for withdrawal');
    }

    const balanceAfter = balanceBefore - amount;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
        totalWithdrawn: String(parseFloat(wallet.totalWithdrawn.toString()) + amount),
      },
    });

    const withdrawal = await withdrawalRequestRepository.create({
      userId,
      walletId: wallet.id,
      amount,
      bankName,
      accountNumber,
      accountHolder,
      note,
    });

    await walletTransactionRepository.create({
      walletId: wallet.id,
      userId,
      type: WalletTransactionType.WITHDRAWAL,
      status: WalletTransactionStatus.PENDING,
      amount: -amount,
      balanceBefore,
      balanceAfter,
      referenceType: 'WITHDRAWAL',
      referenceId: withdrawal.id,
      description: `Yêu cầu rút tiền ${amount} VND`,
    });

    logger.info(`Withdrawal request created: user=${userId}, amount=${amount}`);

    return {
      withdrawal,
      balance: balanceAfter,
    };
  });
};

export const getTransactionHistory = async (userId: number, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    walletTransactionRepository.findByUserId(userId, skip, limit),
    prisma.walletTransaction.count({ where: { userId } }),
  ]);

  return {
    transactions: transactions.map(t => ({
      ...t,
      amount: parseFloat(t.amount.toString()),
      balanceBefore: parseFloat(t.balanceBefore.toString()),
      balanceAfter: parseFloat(t.balanceAfter.toString()),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const approveWithdrawal = async (withdrawalId: number, adminId: number) => {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Withdrawal request is not pending');
    }

    const updatedWithdrawal = await tx.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: WithdrawalStatus.APPROVED,
        processedBy: adminId,
        processedAt: new Date(),
      },
    });

    await walletTransactionRepository.create({
      walletId: withdrawal.walletId,
      userId: withdrawal.userId,
      type: WalletTransactionType.WITHDRAWAL,
      status: WalletTransactionStatus.COMPLETED,
      amount: parseFloat(withdrawal.amount.toString()),
      balanceBefore: parseFloat(withdrawal.amount.toString()),
      balanceAfter: 0,
      referenceType: 'WITHDRAWAL',
      referenceId: withdrawalId,
      description: `Phê duyệt rút tiền ${withdrawal.amount} VND`,
    });

    logger.info(`Withdrawal approved: id=${withdrawalId}, admin=${adminId}`);

    return updatedWithdrawal;
  });
};

export const rejectWithdrawal = async (withdrawalId: number, adminId: number, reason?: string) => {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
      include: { wallet: true },
    });

    if (!withdrawal) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Withdrawal request is not pending');
    }

    const updatedWithdrawal = await tx.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: WithdrawalStatus.REJECTED,
        processedBy: adminId,
        processedAt: new Date(),
        note: reason,
      },
    });

    const balanceBefore = parseFloat(withdrawal.wallet.balance.toString());
    const amount = parseFloat(withdrawal.amount.toString());
    const balanceAfter = balanceBefore + amount;

    await tx.wallet.update({
      where: { id: withdrawal.walletId },
      data: {
        balance: String(balanceAfter),
        totalWithdrawn: String(parseFloat(withdrawal.wallet.totalWithdrawn.toString()) - amount),
      },
    });

    await walletTransactionRepository.create({
      walletId: withdrawal.walletId,
      userId: withdrawal.userId,
      type: WalletTransactionType.WITHDRAWAL,
      status: WalletTransactionStatus.CANCELLED,
      amount: amount,
      balanceBefore,
      balanceAfter,
      referenceType: 'WITHDRAWAL',
      referenceId: withdrawalId,
      description: `Từ chối rút tiền ${amount} VND. Lý do: ${reason || 'Không có lý do'}`,
    });

    logger.info(`Withdrawal rejected: id=${withdrawalId}, admin=${adminId}, reason=${reason}`);

    return updatedWithdrawal;
  });
};

export const getPendingWithdrawals = async () => {
  return withdrawalRequestRepository.findPending();
};

export const getUserWithdrawals = async (userId: number) => {
  return withdrawalRequestRepository.findByUserId(userId);
};

export const depositThroughGateway = async (
  userId: number,
  amount: number,
  gateway: any,
  packageName?: string,
  idempotencyKey?: string
) => {
  if (amount <= 0) {
    throw new SystemException(ErrorCode.INVALID_VALUE, 'Amount must be greater than 0');
  }

  if (idempotencyKey) {
    const existing = await walletTransactionRepository.findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return {
        transaction: existing,
        message: 'Transaction already processed',
      };
    }
  }

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    if (!wallet.isActive) {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Wallet is inactive');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());
    const balanceAfter = balanceBefore + amount;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
        totalDeposited: String(parseFloat(wallet.totalDeposited.toString()) + amount),
      },
    });

    const transaction = await walletTransactionRepository.create({
      walletId: wallet.id,
      userId,
      type: WalletTransactionType.DEPOSIT,
      status: WalletTransactionStatus.COMPLETED,
      amount,
      balanceBefore,
      balanceAfter,
      description: `Nạp tiền qua ${gateway}${packageName ? ` - Gói ${packageName}` : ''}`,
      idempotencyKey,
    });

    logger.info(`Gateway deposit successful: user=${userId}, amount=${amount}, gateway=${gateway}, balance=${balanceAfter}`);

    return {
      transaction,
      balance: balanceAfter,
    };
  });
};

export const simulateGatewayPayment = async (
  userId: number,
  amount: number,
  gateway: any,
  description?: string
) => {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    const gatewayTransaction = await prisma.paymentGatewayTransaction.create({
      data: {
        walletId: wallet.id,
        userId,
        gateway,
        amount: String(amount),
        status: 'PENDING',
        description: description || `Nạp tiền qua ${gateway}`,
        metadata: {
          simulated: true,
          packageName: description,
        },
      },
    });

    logger.info(`Gateway payment created: user=${userId}, amount=${amount}, gateway=${gateway}, txId=${gatewayTransaction.id}`);

    return gatewayTransaction;
  });
};

export const completeGatewayPayment = async (gatewayTransactionId: number, userId: number) => {
  return await prisma.$transaction(async (tx) => {
    const gatewayTx = await tx.paymentGatewayTransaction.findUnique({
      where: { id: gatewayTransactionId },
    });

    if (!gatewayTx) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Transaction not found');
    }

    if (gatewayTx.status !== 'PENDING') {
      throw new SystemException(ErrorCode.INVALID_VALUE, 'Transaction is not pending');
    }

    const updatedGatewayTx = await tx.paymentGatewayTransaction.update({
      where: { id: gatewayTransactionId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
        gatewayTransactionId: `SIM_${gatewayTransactionId}_${Date.now()}`,
      },
    });

    const wallet = await tx.wallet.findUnique({
      where: { userId: gatewayTx.userId },
    });

    if (!wallet) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Wallet not found');
    }

    const balanceBefore = parseFloat(wallet.balance.toString());
    const amount = parseFloat(gatewayTx.amount.toString());
    const balanceAfter = balanceBefore + amount;

    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: String(balanceAfter),
        totalDeposited: String(parseFloat(wallet.totalDeposited.toString()) + amount),
      },
    });

    await walletTransactionRepository.create({
      walletId: wallet.id,
      userId: gatewayTx.userId,
      type: WalletTransactionType.DEPOSIT,
      status: WalletTransactionStatus.COMPLETED,
      amount,
      balanceBefore,
      balanceAfter,
      referenceType: 'GATEWAY_TRANSACTION',
      referenceId: gatewayTransactionId,
      description: `Nạp tiền qua ${gatewayTx.gateway}${gatewayTx.description ? ` - ${gatewayTx.description}` : ''}`,
    });

    logger.info(`Gateway payment completed: txId=${gatewayTransactionId}, user=${userId}, amount=${amount}`);

    return updatedGatewayTx;
  });
};

export const failGatewayPayment = async (gatewayTransactionId: number, reason?: string) => {
  return await prisma.$transaction(async (tx) => {
    const gatewayTx = await tx.paymentGatewayTransaction.findUnique({
      where: { id: gatewayTransactionId },
    });

    if (!gatewayTx) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Transaction not found');
    }

    const updatedGatewayTx = await tx.paymentGatewayTransaction.update({
      where: { id: gatewayTransactionId },
      data: {
        status: 'FAILED',
        gatewayResponse: { reason, failedAt: new Date().toISOString() },
      },
    });

    logger.info(`Gateway payment failed: txId=${gatewayTransactionId}, reason=${reason}`);

    return updatedGatewayTx;
  });
};

export const cancelGatewayPayment = async (gatewayTransactionId: number) => {
  return await prisma.$transaction(async (tx) => {
    const gatewayTx = await tx.paymentGatewayTransaction.findUnique({
      where: { id: gatewayTransactionId },
    });

    if (!gatewayTx) {
      throw new SystemException(ErrorCode.RESOURCE_NOT_FOUND, 'Transaction not found');
    }

    const updatedGatewayTx = await tx.paymentGatewayTransaction.update({
      where: { id: gatewayTransactionId },
      data: {
        status: 'CANCELLED',
      },
    });

    logger.info(`Gateway payment cancelled: txId=${gatewayTransactionId}`);

    return updatedGatewayTx;
  });
};
