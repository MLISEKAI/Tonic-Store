import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import logger from '../config/logger';
import { CacheService } from './cache.service';
import { isRedisAvailable } from './cache.service';
import { processOrderJob } from './processors/orderProcessor';
import { processEmailJob } from './processors/emailProcessor';
import { processNotificationJob } from './processors/notificationProcessor';
import { processStatsJob } from './processors/statsProcessor';
import { processProductIndexJob } from './processors/productProcessor';

export enum JobType {
  ORDER_PROCESSING = 'order:processing',
  ORDER_NOTIFICATION = 'order:notification',
  EMAIL_SENDING = 'email:sending',
  NOTIFICATION_CREATE = 'notification:create',
  STATS_COMPUTATION = 'stats:computation',
  PRODUCT_INDEX = 'product:index',
  INVENTORY_SYNC = 'inventory:sync',
}

export interface OrderProcessingJobData {
  orderId: number;
  userId: number;
  items: Array<{ productId: number; quantity: number; price: number }>;
  status: string;
}

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  userId?: number;
}

export interface NotificationJobData {
  userId: number;
  message: string;
  orderId?: number;
}

export interface StatsComputationJobData {
  type: 'daily' | 'weekly' | 'monthly' | 'manual';
}

export interface ProductIndexJobData {
  productId: number;
  action: 'index' | 'update' | 'delete';
}

export interface InventorySyncJobData {
  productId: number;
  quantity: number;
}

const DEFAULT_TTL = 24 * 60 * 60;

export const QueueEventsMap: Record<JobType, string> = {
  [JobType.ORDER_PROCESSING]: 'order:processing',
  [JobType.ORDER_NOTIFICATION]: 'order:notification',
  [JobType.EMAIL_SENDING]: 'email:sending',
  [JobType.NOTIFICATION_CREATE]: 'notification:create',
  [JobType.STATS_COMPUTATION]: 'stats:computation',
  [JobType.PRODUCT_INDEX]: 'product:index',
  [JobType.INVENTORY_SYNC]: 'inventory:sync',
};

let orderQueue: Queue | null = null;
let emailQueue: Queue | null = null;
let notificationQueue: Queue | null = null;
let statsQueue: Queue | null = null;
let productQueue: Queue | null = null;

let orderScheduler: QueueEvents | null = null;
let emailScheduler: QueueEvents | null = null;
let notificationScheduler: QueueEvents | null = null;
let statsScheduler: QueueEvents | null = null;
let productScheduler: QueueEvents | null = null;

function getRedisConnection() {
  return CacheService.getClient();
}

function createQueue(name: string): Queue | null {
  if (!isRedisAvailable()) {
    logger.warn(`Redis not available, queue "${name}" disabled`);
    return null;
  }
  try {
    return new Queue(name, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: DEFAULT_TTL },
        removeOnFail: { age: DEFAULT_TTL },
      },
    });
  } catch (err) {
    logger.error(`Failed to create queue "${name}"`, { err: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

function createScheduler(name: string): QueueEvents | null {
  if (!isRedisAvailable()) return null;
  try {
    return new QueueEvents(name, { connection: getRedisConnection() });
  } catch (err) {
    logger.error(`Failed to create scheduler for "${name}"`, { err: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

function createWorker(name: string, processor: (job: Job) => Promise<void>): Worker | null {
  if (!isRedisAvailable()) {
    logger.warn(`Redis not available, worker "${name}" disabled`);
    return null;
  }
  try {
    const worker = new Worker(name, processor, {
      connection: getRedisConnection(),
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
      lockDuration: 30000,
    });

    worker.on('error', (err: Error) => {
      logger.error(`Worker "${name}" error`, { err: err.message });
    });

    worker.on('drained', () => {
      logger.info(`Worker "${name}" drained (queue empty)`);
    });

    return worker;
  } catch (err) {
    logger.error(`Failed to create worker "${name}"`, { err: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

export const QueueService = {
  getOrderQueue(): Queue | null {
    return orderQueue;
  },
  getEmailQueue(): Queue | null {
    return emailQueue;
  },
  getNotificationQueue(): Queue | null {
    return notificationQueue;
  },
  getStatsQueue(): Queue | null {
    return statsQueue;
  },
  getProductQueue(): Queue | null {
    return productQueue;
  },

  async addOrderProcessingJob(data: OrderProcessingJobData, options?: { delay?: number; priority?: number }): Promise<Job | null> {
    if (!orderQueue) return null;
    return orderQueue.add(JobType.ORDER_PROCESSING, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  },

  async addEmailJob(data: EmailJobData, options?: { delay?: number; priority?: number }): Promise<Job | null> {
    if (!emailQueue) return null;
    return emailQueue.add(JobType.EMAIL_SENDING, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  },

  async addNotificationJob(data: NotificationJobData, options?: { delay?: number; priority?: number }): Promise<Job | null> {
    if (!notificationQueue) return null;
    return notificationQueue.add(JobType.NOTIFICATION_CREATE, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  },

  async addStatsJob(data: StatsComputationJobData, options?: { delay?: number; priority?: number }): Promise<Job | null> {
    if (!statsQueue) return null;
    return statsQueue.add(JobType.STATS_COMPUTATION, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  },

  async addProductIndexJob(data: ProductIndexJobData, options?: { delay?: number; priority?: number }): Promise<Job | null> {
    if (!productQueue) return null;
    return productQueue.add(JobType.PRODUCT_INDEX, data, {
      priority: options?.priority,
      delay: options?.delay,
    });
  },
};

let workers: (Worker | null)[] = [];

export async function setupQueues(): Promise<void> {
  orderQueue = createQueue('order-processing');
  emailQueue = createQueue('email-sending');
  notificationQueue = createQueue('notification-creation');
  statsQueue = createQueue('stats-computation');
  productQueue = createQueue('product-index');

  orderScheduler = createScheduler('order-processing');
  emailScheduler = createScheduler('email-sending');
  notificationScheduler = createScheduler('notification-creation');
  statsScheduler = createScheduler('stats-computation');
  productScheduler = createScheduler('product-index');

  const orderWorker = createWorker('order-processing', processOrderJob);
  const emailWorker = createWorker('email-sending', processEmailJob);
  const notificationWorker = createWorker('notification-creation', processNotificationJob);
  const statsWorker = createWorker('stats-computation', processStatsJob);
  const productWorker = createWorker('product-index', processProductIndexJob);

  workers = [orderWorker, emailWorker, notificationWorker, statsWorker, productWorker];

  logger.info('Queue service initialized', {
    queues: ['order-processing', 'email-sending', 'notification-creation', 'stats-computation', 'product-index'],
    workersActive: workers.filter((w) => w !== null).length,
  });
}

export async function closeQueues(): Promise<void> {
  for (const worker of workers) {
    if (worker) {
      await worker.close();
    }
  }
  workers = [];

  const queues = [orderQueue, emailQueue, notificationQueue, statsQueue, productQueue];
  for (const queue of queues) {
    if (queue) await queue.close();
  }

  const schedulers = [orderScheduler, emailScheduler, notificationScheduler, statsScheduler, productScheduler];
  for (const scheduler of schedulers) {
    if (scheduler) await scheduler.close();
  }

  orderQueue = null;
  emailQueue = null;
  notificationQueue = null;
  statsQueue = null;
  productQueue = null;

  orderScheduler = null;
  emailScheduler = null;
  notificationScheduler = null;
  statsScheduler = null;
  productScheduler = null;

  logger.info('All queues and workers closed');
}

export async function getQueueHealth(): Promise<Record<string, unknown>> {
  const health: Record<string, unknown> = {};

  const checks: Array<[string, Queue | null]> = [
    ['order-processing', orderQueue],
    ['email-sending', emailQueue],
    ['notification-creation', notificationQueue],
    ['stats-computation', statsQueue],
    ['product-index', productQueue],
  ];

  for (const [name, queue] of checks) {
    if (!queue) {
      health[name] = { available: false };
      continue;
    }
    try {
      const [waiting, active, delayed, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getDelayedCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
      ]);

      void delayed;

      health[name] = {
        available: true,
        waiting,
        active,
        completed,
        failed,
      };
    } catch (err) {
      health[name] = { available: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return health;
}
