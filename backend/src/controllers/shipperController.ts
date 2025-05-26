import { Request, Response } from 'express';
import * as shipperService from '../services/shipperService';
import { OrderStatus } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ShipperController = {
  // Lấy danh sách shipper (admin only)
  async getAllShippers(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const shippers = await shipperService.getAllShippers();
      res.json(shippers);
    } catch (error) {
      console.error('Error getting shippers:', error);
      res.status(500).json({ error: 'Failed to get shippers' });
    }
  },

  // Lấy thông tin chi tiết shipper
  async getShipperById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shipper = await shipperService.getShipperById(Number(id));

      if (!shipper) {
        return res.status(404).json({ error: 'Shipper not found' });
      }

      res.json(shipper);
    } catch (error) {
      console.error('Error getting shipper:', error);
      res.status(500).json({ error: 'Failed to get shipper' });
    }
  },

  // Gán shipper cho đơn hàng (admin only)
  async assignShipperToOrder(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { orderId } = req.params;
      const { shipperId } = req.body;

      if (!shipperId) {
        return res.status(400).json({ error: 'Shipper ID is required' });
      }

      const order = await shipperService.assignShipperToOrder(Number(orderId), Number(shipperId));
      res.json(order);
    } catch (error) {
      console.error('Error assigning shipper:', error);
      res.status(500).json({ error: 'Failed to assign shipper' });
    }
  },

  // Cập nhật trạng thái giao hàng (shipper only)
  async updateDeliveryStatus(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'DELIVERY') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { orderId } = req.params;
      const { status, note } = req.body;
      const shipperId = req.user.id;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const order = await shipperService.updateDeliveryStatus(
        Number(orderId),
        shipperId,
        status as OrderStatus,
        note
      );

      res.json(order);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      res.status(500).json({ error: 'Failed to update delivery status' });
    }
  },

  // Lấy danh sách đơn hàng của shipper
  async getShipperOrders(req: Request, res: Response) {
    try {
      console.log('Headers:', req.headers);
      console.log('Authorization:', req.headers.authorization);
      console.log('req.user:', req.user);

      if (!req.user) {
        console.log('No user attached to request');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role !== 'DELIVERY') {
        console.log('User role is not DELIVERY:', req.user.role);
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { status } = req.query;
      console.log('Getting orders for shipper:', req.user.id, 'with status:', status);
      
      const orders = await shipperService.getShipperOrders(
        req.user.id,
        status as OrderStatus
      );

      res.json(orders);
    } catch (error) {
      console.error('Error getting shipper orders:', error);
      res.status(500).json({ error: 'Failed to get shipper orders' });
    }
  },

  // Lấy lịch sử giao hàng của đơn hàng
  async getOrderDeliveryLogs(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const logs = await shipperService.getOrderDeliveryLogs(Number(orderId));
      res.json(logs);
    } catch (error) {
      console.error('Error getting delivery logs:', error);
      res.status(500).json({ error: 'Failed to get delivery logs' });
    }
  },

  // Lấy đánh giá shipper của một đơn hàng
  async getDeliveryRating(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      console.log('Getting delivery rating for order:', orderId);
      
      if (!orderId) {
        console.error('Order ID is missing');
        return res.status(400).json({ error: 'Order ID is required' });
      }

      const orderIdNumber = Number(orderId);
      
      if (isNaN(orderIdNumber)) {
        console.error('Invalid order ID:', orderId);
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const rating = await shipperService.getDeliveryRating(orderIdNumber);
      console.log('Rating result:', rating);
      
      // Nếu không có đánh giá, trả về null thay vì lỗi
      if (rating === null) {
        return res.json(null);
      }
      
      res.json(rating);
    } catch (error: any) {
      console.error('Error getting delivery rating:', error);
      if (error.message === 'Invalid order ID') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Order is not delivered yet') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to get delivery rating' });
    }
  },

  // Tạo đánh giá shipper
  async createDeliveryRating(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { orderId } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating value' });
      }

      const newRating = await shipperService.createDeliveryRating(
        Number(orderId),
        req.user.id,
        rating,
        comment
      );

      res.status(201).json(newRating);
    } catch (error: any) {
      console.error('Error creating delivery rating:', error);
      if (error.message === 'Order is not delivered yet') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Order has already been rated') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create delivery rating' });
    }
  }
}; 