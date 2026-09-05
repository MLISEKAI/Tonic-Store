import { Job } from 'bullmq';
import logger from '../../config/logger';
import { NotificationJobData } from '../queue.service';

export async function processNotificationJob(job: Job): Promise<void> {
  const data = job.data as NotificationJobData;
  logger.info('Processing notification job', { userId: data.userId });

  try {
    const { prisma } = await import('../../prisma');
    await prisma.notification.create({
      data: {
        userId: data.userId,
        message: data.message,
        isRead: false,
      },
    });
    logger.info('Notification created', { userId: data.userId, orderId: data.orderId });
  } catch (err) {
    logger.error('Notification job failed', {
      userId: data.userId,
      err: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
