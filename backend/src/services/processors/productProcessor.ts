import { Job } from 'bullmq';
import logger from '../../config/logger';
import { ProductIndexJobData } from '../queue.service';
import { CacheService, CacheKeys } from '../cache.service';

export async function processProductIndexJob(job: Job): Promise<void> {
  const data = job.data as ProductIndexJobData;
  logger.info('Processing product index job', { productId: data.productId, action: data.action });

  if (data.action === 'index' || data.action === 'update') {
    await CacheService.delete(CacheKeys.PRODUCT_DETAIL(data.productId));
    await CacheService.deletePattern('products:*');
  } else if (data.action === 'delete') {
    await CacheService.delete(CacheKeys.PRODUCT_DETAIL(data.productId));
    await CacheService.deletePattern('products:*');
  }
}
