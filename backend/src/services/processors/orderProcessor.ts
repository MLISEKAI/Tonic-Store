import { Job } from 'bullmq';
import logger from '../../config/logger';
import { OrderProcessingJobData } from '../queue.service';
import { CacheService } from '../cache.service';
import { CacheKeys } from '../cache.service';

export async function processOrderJob(job: Job): Promise<void> {
  const data = job.data as OrderProcessingJobData;
  logger.info('Processing order background job', { orderId: data.orderId, userId: data.userId });

  try {
    await CacheService.deletePattern('orders:*');
    await CacheService.delete(CacheKeys.STATS());
    await CacheService.deletePattern('products:*');

    logger.info('Order background processing completed', { orderId: data.orderId });
  } catch (err) {
    logger.error('Order background processing failed', {
      orderId: data.orderId,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
