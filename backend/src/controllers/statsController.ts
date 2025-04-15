import { Request, Response } from 'express';
import prisma from '../prisma';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  productId: number;
  _sum: {
    quantity: number | null;
  };
}

export const getStats = async (req: Request, res: Response) => {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();
    
    // Get total users
    const totalUsers = await prisma.user.count();
    
    // Get total orders
    const totalOrders = await prisma.order.count();
    
    // Get total revenue
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED
      },
      select: {
        totalPrice: true
      }
    });
    
    const totalRevenue = orders.reduce((sum: number, order) => sum + order.totalPrice, 0);
    
    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });
    
    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });
    
    const productsWithDetails = await Promise.all(
      topProducts.map(async (item: OrderItem) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          name: product?.name || 'Unknown',
          value: item._sum.quantity || 0
        };
      })
    );

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topProducts: productsWithDetails
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 