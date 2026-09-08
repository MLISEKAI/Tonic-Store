import { Request, Response } from 'express';
import {
  withdraw,
  getPendingWithdrawals,
  getUserWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from '../services/walletService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

export const requestWithdrawalController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount, bankName, accountNumber, accountHolder, note } = req.body;

    if (!amount || amount <= 0) {
      res.apiError('Invalid amount', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!bankName || !accountNumber || !accountHolder) {
      res.apiError('Bank details are required', ErrorCodes.BAD_REQUEST);
      return;
    }

    const result = await withdraw(userId, amount, bankName, accountNumber, accountHolder, note);

    res.apiSuccess({
      withdrawal: result.withdrawal,
      balance: result.balance,
    }, "Yêu cầu rút tiền thành công");
  } catch (error: any) {
    if (error.message?.includes('Insufficient balance')) {
      res.apiError('Insufficient balance for withdrawal', ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "requestWithdrawalController");
  }
};

export const getMyWithdrawalsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const withdrawals = await getUserWithdrawals(userId);

    res.apiSuccess(withdrawals, "Lấy danh sách rút tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "getMyWithdrawalsController");
  }
};

export const getPendingWithdrawalsController = async (req: Request, res: Response) => {
  try {
    const pending = await getPendingWithdrawals();

    res.apiSuccess(pending, "Lấy danh sách chờ duyệt thành công");
  } catch (error) {
    handleControllerError(res, error, "getPendingWithdrawalsController");
  }
};

export const approveWithdrawalController = async (req: Request, res: Response) => {
  try {
    const adminId = req.user!.id;
    const withdrawalId = parseInt(req.params.id);

    const result = await approveWithdrawal(withdrawalId, adminId);

    res.apiSuccess({ withdrawal: result }, "Duyệt rút tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "approveWithdrawalController");
  }
};

export const rejectWithdrawalController = async (req: Request, res: Response) => {
  try {
    const adminId = req.user!.id;
    const withdrawalId = parseInt(req.params.id);
    const { reason } = req.body;

    const result = await rejectWithdrawal(withdrawalId, adminId, reason);

    res.apiSuccess({ withdrawal: result }, "Từ chối rút tiền thành công");
  } catch (error) {
    handleControllerError(res, error, "rejectWithdrawalController");
  }
};
