import { PrismaClient } from '@prisma/client';
import { IStatsRepository } from './interfaces/IStatsRepository';

export class StatsRepository implements IStatsRepository {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getStats(): Promise<any> {
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUsers,
      recentOrders,
      topProducts,
      salesByCategory
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalPrice: true }
      }),
      this.prisma.user.count(),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { soldCount: 'desc' },
        select: { id: true, name: true, price: true, soldCount: true, imageUrl: true }
      }),
      this.prisma.category.findMany({
        include: { products: { select: { soldCount: true, price: true } } }
      })
    ]);
    const categorySales = salesByCategory.map((category: any) => {
      const totalSales = category.products.reduce((sum: number, product: any) => sum + (Number(product.price) * product.soldCount), 0);
      return { categoryId: category.id, categoryName: category.name, totalSales };
    });
    return {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalUsers,
      recentOrders,
      topProducts,
      categorySales
    };
  }
} 