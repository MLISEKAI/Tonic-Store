import type { Request, Response } from 'express';
import * as shipperService from '../services/shipperService';
import { OrderStatus } from '@prisma/client';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import logger from '../config/logger';

export const ShipperController = {
  async getAllShippers(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
        return;
      }
      const shippers = await shipperService.getAllShippers();
      res.apiSuccess(shippers, "Lấy danh sách shipper thành công");
    } catch (error) {
      handleControllerError(res, error, "getAllShippers");
    }
  },

  async getShipperById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shipper = await shipperService.getShipperById(Number(id));
      if (!shipper) {
        res.apiError('Shipper not found', ErrorCodes.NOT_FOUND);
        return;
      }
      res.apiSuccess(shipper, "Lấy thông tin shipper thành công");
    } catch (error) {
      handleControllerError(res, error, "getShipperById");
    }
  },

  async assignShipperToOrder(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
        return;
      }
      const { orderId } = req.params;
      const { shipperId } = req.body;
      if (!shipperId) {
        res.apiError('Shipper ID is required', ErrorCodes.BAD_REQUEST);
        return;
      }
      const order = await shipperService.assignShipperToOrder(Number(orderId), Number(shipperId));
      res.apiSuccess(order, "Gán shipper thành công");
    } catch (error) {
      handleControllerError(res, error, "assignShipperToOrder");
    }
  },

  async updateDeliveryStatus(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'DELIVERY') {
        res.apiError('Unauthorized', ErrorCodes.FORBIDDEN);
        return;
      }
      const { orderId } = req.params;
      const { status, note } = req.body;
      const shipperId = req.user.id;
      if (!status || !Object.values(OrderStatus).includes(status)) {
        res.apiError('Invalid status', ErrorCodes.BAD_REQUEST);
        return;
      }
      const order = await shipperService.updateDeliveryStatus(
        Number(orderId),
        shipperId,
        status as OrderStatus,
        note
      );
      res.apiSuccess(order, "Cập nhật trạng thái giao hàng thành công");
    } catch (error) {
      handleControllerError(res, error, "updateDeliveryStatus");
    }
  },

  async getShipperOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }
      if (req.user.role !== 'DELIVERY') {
        res.apiError('Forbidden', ErrorCodes.FORBIDDEN);
        return;
      }
      const { status } = req.query;
      const orders = await shipperService.getShipperOrders(
        req.user.id,
        status as OrderStatus
      );
      res.apiSuccess(orders, "Lấy danh sách đơn hàng thành công");
    } catch (error) {
      handleControllerError(res, error, "getShipperOrders");
    }
  },

  async getOrderDeliveryLogs(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const logs = await shipperService.getOrderDeliveryLogs(Number(orderId));
      res.apiSuccess(logs, "Lấy lịch sử giao hàng thành công");
    } catch (error) {
      handleControllerError(res, error, "getOrderDeliveryLogs");
    }
  },

  async getDeliveryRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orderId = Number(id);
      if (!orderId || isNaN(orderId)) {
        res.apiError('Order ID không hợp lệ', ErrorCodes.BAD_REQUEST);
        return;
      }
      const rating = await shipperService.getDeliveryRating(orderId);
      res.apiSuccess(rating, "Lấy đánh giá giao hàng thành công");
    } catch (error: any) {
      if (error.message === 'Invalid order ID') {
        res.apiError(error.message, ErrorCodes.BAD_REQUEST);
        return;
      }
      if (error.message === 'Order not found') {
        res.apiError(error.message, ErrorCodes.NOT_FOUND);
        return;
      }
      if (error.message === 'Order is not delivered yet') {
        res.apiError(error.message, ErrorCodes.BAD_REQUEST);
        return;
      }
      handleControllerError(res, error, "getDeliveryRating");
    }
  },

  async createDeliveryRating(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.apiError('Unauthorized', ErrorCodes.UNAUTHORIZED);
        return;
      }
      const { id } = req.params;
      const orderId = Number(id);
      const { rating, comment } = req.body;
      if (!orderId || isNaN(orderId)) {
        res.apiError('Order ID không hợp lệ', ErrorCodes.BAD_REQUEST);
        return;
      }
      if (!rating || rating < 1 || rating > 5) {
        res.apiError('Invalid rating value', ErrorCodes.BAD_REQUEST);
        return;
      }
      const newRating = await shipperService.createDeliveryRating(
        orderId,
        req.user.id,
        rating,
        comment
      );
      res.apiSuccess(newRating, "Tạo đánh giá thành công", 201);
    } catch (error: any) {
      if (error.message === 'Order is not delivered yet' || error.message === 'Order has already been rated') {
        res.apiError(error.message, ErrorCodes.BAD_REQUEST);
        return;
      }
      handleControllerError(res, error, "createDeliveryRating");
    }
  }
};
