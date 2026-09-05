import { Job } from 'bullmq';
import logger from '../../config/logger';
import { StatsComputationJobData } from '../queue.service';
import { CacheService, CacheKeys } from '../cache.service';

export async function processStatsJob(job: Job): Promise<void> {
  const data = job.data as StatsComputationJobData;
  logger.info('Processing stats computation job', { type: data.type });

  try {
    const { prisma } = await import('../../prisma');
    const statsResult = await prisma.$transaction(async (tx) => {
      const totalProducts = await tx.product.count();
      const totalUsers = await tx.user.count();
      const totalOrders = await tx.order.count();
      const revenueResult = await tx.order.aggregate({
        where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalPrice: true },
      });
      return {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: Number(revenueResult._sum.totalPrice || 0),
      };
    });

    await CacheService.set(CacheKeys.STATS(), statsResult, 300);
    logger.info('Stats computation completed', { type: data.type, result: statsResult });
  } catch (err) {
    logger.error('Stats computation job failed', {
      type: data.type,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
