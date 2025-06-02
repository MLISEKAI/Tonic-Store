export interface StatsData {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{
    status: string;
    _count: {
      status: number;
    };
  }>;
  topProducts: Array<{
    name: string;
    value: number;
  }>;
} 