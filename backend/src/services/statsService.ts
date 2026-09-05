import { prisma } from '../prisma';
import { CacheService, CacheKeys } from './cache.service';
import logger from '../config/logger';

export const getStats = async () => {
  const cacheKey = CacheKeys.STATS();
  const cached = await CacheService.get(cacheKey);
  if (cached) {
    logger.debug('Stats cache HIT');
    return cached;
  }

  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders,
    topProducts,
    salesByCategory
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalPrice: true }
    }),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { soldCount: 'desc' },
      select: { id: true, name: true, price: true, soldCount: true, imageUrl: true }
    }),
    prisma.category.findMany({
      include: { products: { select: { soldCount: true, price: true } } }
    })
  ]);

  const categorySales = salesByCategory.map(category => {
    const totalSales = category.products.reduce((sum, product) => {
      return sum + (Number(product.price) * product.soldCount);
    }, 0);

    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSales
    };
  });

  const result = {
    totalProducts,
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.totalPrice || 0),
    totalUsers,
    recentOrders,
    topProducts,
    categorySales
  };

  await CacheService.set(cacheKey, result, 300);
  return result;
};

export const getSalesByDate = async (startDate: Date, endDate: Date) => {
  const cacheKey = CacheKeys.STATS_SALES_BY_DATE(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
    },
    select: { createdAt: true, totalPrice: true },
    orderBy: { createdAt: 'asc' }
  });

  const salesByDay = orders.reduce((acc: Record<string, number>, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + Number(order.totalPrice);
    return acc;
  }, {});

  await CacheService.set(cacheKey, salesByDay, 300);
  return salesByDay;
};

export const getTopCustomers = async (limit: number = 10) => {
  const cacheKey = CacheKeys.STATS_TOP_CUSTOMERS(limit);
  const cached = await CacheService.get(cacheKey);
  if (cached) return cached;

  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      orders: {
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        select: { totalPrice: true }
      }
    }
  });

  const customersWithSpending = customers.map(customer => {
    const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      totalSpent,
      orderCount: customer.orders.length
    };
  });

  const result = customersWithSpending
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);

  await CacheService.set(cacheKey, result, 300);
  return result;
};