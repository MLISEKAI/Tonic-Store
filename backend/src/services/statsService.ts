import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStats = async () => {
  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders,
    topProducts,
    salesByCategory
  ] = await Promise.all([
    // Tổng số sản phẩm
    prisma.product.count(),
    
    // Tổng số đơn hàng
    prisma.order.count(),
    
    // Tổng doanh thu
    prisma.order.aggregate({
      where: {
        status: {
          in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
        }
      },
      _sum: {
        totalPrice: true
      }
    }),
    
    // Tổng số người dùng
    prisma.user.count(),
    
    // Đơn hàng gần đây
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),
    
    // Sản phẩm bán chạy
    prisma.product.findMany({
      take: 5,
      orderBy: {
        soldCount: 'desc'
      },
      select: {
        id: true,
        name: true,
        price: true,
        soldCount: true,
        imageUrl: true
      }
    }),
    
    // Doanh số theo danh mục
    prisma.category.findMany({
      include: {
        products: {
          select: {
            soldCount: true,
            price: true
          }
        }
      }
    })
  ]);

  // Tính doanh số theo danh mục
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

  return {
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalPrice || 0,
    totalUsers,
    recentOrders,
    topProducts,
    categorySales
  };
};

export const getSalesByDate = async (startDate: Date, endDate: Date) => {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      status: {
        in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
      }
    },
    select: {
      createdAt: true,
      totalPrice: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Nhóm theo ngày
  const salesByDay = orders.reduce((acc: Record<string, number>, order) => {
    const date = order.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + Number(order.totalPrice);
    return acc;
  }, {});

  return salesByDay;
};

export const getTopCustomers = async (limit: number = 10) => {
  const customers = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER'
    },
    include: {
      orders: {
        where: {
          status: {
            in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        select: {
          totalPrice: true
        }
      }
    }
  });

  // Tính tổng chi tiêu của mỗi khách hàng
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

  // Sắp xếp theo tổng chi tiêu
  return customersWithSpending
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}; 