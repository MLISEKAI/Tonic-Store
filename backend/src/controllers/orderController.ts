import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const OrderController = {
  // Create new order
  async createOrder(req: Request, res: Response) {
    try {
      const { userId, items, shippingAddress, shippingPhone, shippingName, note, paymentMethod } = req.body;

      // Calculate total price
      const totalPrice = items.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          totalPrice,
          shippingAddress,
          shippingPhone,
          shippingName,
          note,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          },
          payment: {
            create: {
              method: paymentMethod,
              amount: totalPrice,
              transactionId: uuidv4()
            }
          }
        },
        include: {
          items: true,
          payment: true
        }
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  // Get order by ID
  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          items: {
            include: {
              product: true
            }
          },
          payment: true,
          user: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get order' });
    }
  },

  // Get user's orders
  async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await prisma.order.findMany({
        where: { userId: Number(userId) },
        include: {
          items: {
            include: {
              product: true
            }
          },
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user orders' });
    }
  },

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: Number(id) },
        data: { status }
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  },

  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      const payment = await prisma.payment.update({
        where: { orderId: Number(id) },
        data: { 
          status,
          transactionId,
          paymentDate: status === 'COMPLETED' ? new Date() : undefined
        }
      });

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update payment status' });
    }
  },

  // Get all orders (admin)
  async getAllOrders(req: Request, res: Response) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      
      const where = status ? { status } : {};
      
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: {
              include: {
                product: true
              }
            },
            payment: true,
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }),
        prisma.order.count({ where })
      ]);

      res.json({
        orders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get orders' });
    }
  }
}; 