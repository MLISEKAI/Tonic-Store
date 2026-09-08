import type { Request, Response } from 'express';
import {
  getOrCreateWallet,
  getBalance,
  topUp,
  deduct,
  refund,
  getTransactionHistory,
} from '../services/walletService';
import { WalletTransactionType } from '@prisma/client';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions, calculatePagination } from '../common/types/pagination';
import logger from '../config/logger';

export const getWalletController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const wallet = await getOrCreateWallet(userId);
    const balance = await getBalance(userId);

    res.apiSuccess({
      id: wallet.id,
      userId: wallet.userId,
      ...balance,
      isActive: wallet.isActive,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    }, "Lấy thông tin ví thành công");
  } catch (error) {
    handleControllerError(res, error, "getWalletController");
  }
};

export const topUpController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount, description, idempotencyKey } = req.body;

    if (!amount || amount <= 0) {
      res.apiError('Invalid amount', ErrorCodes.BAD_REQUEST);
      return;
    }

    const result = await topUp(userId, amount, idempotencyKey, description) as any;

    res.apiSuccess({
      transaction: result.transaction,
      balance: result.balance,
    }, "Nạp tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "topUpController");
  }
};

export const deductController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount, referenceType, referenceId, description, idempotencyKey } = req.body;

    if (!amount || amount <= 0) {
      res.apiError('Invalid amount', ErrorCodes.BAD_REQUEST);
      return;
    }

    const result = await deduct(
      userId,
      amount,
      WalletTransactionType.PAYMENT,
      referenceType,
      referenceId,
      description,
      idempotencyKey
    ) as any;

    res.apiSuccess({
      transaction: result.transaction,
      balance: result.balance,
    }, "Thanh toán thành công");
  } catch (error: any) {
    if (error.message?.includes('Insufficient balance')) {
      res.apiError('Insufficient balance', ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "deductController");
  }
};

export const refundController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount, referenceType, referenceId, description, idempotencyKey } = req.body;

    if (!amount || amount <= 0) {
      res.apiError('Invalid amount', ErrorCodes.BAD_REQUEST);
      return;
    }

    const result = await refund(userId, amount, referenceType, referenceId, description, idempotencyKey) as any;

    res.apiSuccess({
      transaction: result.transaction,
      balance: result.balance,
    }, "Hoàn tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "refundController");
  }
};

export const getTransactionHistoryController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const pagination = parsePageOptions(req.query);

    const result = await getTransactionHistory(userId, pagination.page, pagination.limit);

    const paginationMeta = calculatePagination(result.total, pagination.limit, pagination.page);
    res.apiSuccess(result.transactions, "Lấy lịch sử giao dịch thành công", 200, paginationMeta);
  } catch (error) {
    handleControllerError(res, error, "getTransactionHistoryController");
  }
};
