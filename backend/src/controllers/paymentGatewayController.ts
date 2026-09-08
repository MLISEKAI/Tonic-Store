import type { Request, Response } from 'express';
import {
  simulateGatewayPayment,
  completeGatewayPayment,
  failGatewayPayment,
  cancelGatewayPayment,
} from '../services/walletService';
import { PaymentGateway } from '@prisma/client';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

export const createGatewayPaymentController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount, gateway, packageName } = req.body;

    if (!amount || amount <= 0) {
      res.apiError('Invalid amount', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!gateway || !Object.values(PaymentGateway).includes(gateway)) {
      res.apiError('Invalid payment gateway', ErrorCodes.BAD_REQUEST);
      return;
    }

    const gatewayTx = await simulateGatewayPayment(userId, amount, gateway, packageName);

    res.apiSuccess({ transaction: gatewayTx }, "Khởi tạo thanh toán thành công", 201);
  } catch (error) {
    handleControllerError(res, error, "createGatewayPaymentController");
  }
};

export const completeGatewayPaymentController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const transactionId = parseInt(req.params.id);

    const result = await completeGatewayPayment(transactionId, userId);

    res.apiSuccess({ transaction: result }, "Thanh toán hoàn tất");
  } catch (error) {
    handleControllerError(res, error, "completeGatewayPaymentController");
  }
};

export const failGatewayPaymentController = async (req: Request, res: Response) => {
  try {
    const transactionId = parseInt(req.params.id);
    const { reason } = req.body;

    const result = await failGatewayPayment(transactionId, reason);

    res.apiSuccess({ transaction: result }, "Thanh toán thất bại");
  } catch (error) {
    handleControllerError(res, error, "failGatewayPaymentController");
  }
};

export const cancelGatewayPaymentController = async (req: Request, res: Response) => {
  try {
    const transactionId = parseInt(req.params.id);

    const result = await cancelGatewayPayment(transactionId);

    res.apiSuccess({ transaction: result }, "Hủy thanh toán thành công");
  } catch (error) {
    handleControllerError(res, error, "cancelGatewayPaymentController");
  }
};
