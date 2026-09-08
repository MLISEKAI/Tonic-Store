import type { Request, Response } from 'express';
import * as statsService from '../services/statsService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getStats();
    res.apiSuccess(stats, "Lấy thống kê thành công");
  } catch (error) {
    handleControllerError(res, error, "getStats");
  }
};

export const getSalesByDateHandler = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.apiError('startDate and endDate are required', ErrorCodes.BAD_REQUEST);
      return;
    }
    const result = await statsService.getSalesByDate(new Date(startDate as string), new Date(endDate as string));
    res.apiSuccess(result, "Lấy doanh số theo ngày thành công");
  } catch (error) {
    handleControllerError(res, error, "getSalesByDateHandler");
  }
};

export const getTopCustomersHandler = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const customers = await statsService.getTopCustomers(limit);
    res.apiSuccess(customers, "Lấy top khách hàng thành công");
  } catch (error) {
    handleControllerError(res, error, "getTopCustomersHandler");
  }
};
