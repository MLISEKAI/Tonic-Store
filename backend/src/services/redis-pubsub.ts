import Redis from 'ioredis';
import logger from '../config/logger';
import { CacheService } from './cache.service';

export type ChannelHandler = (channel: string, message: string) => Promise<void>;

interface Subscription {
  channel: string;
  handler: ChannelHandler;
  subscriber: Redis;
}

const subscriptions = new Map<string, Subscription>();

export const PubSubService = {
  async publish(channel: string, message: any): Promise<number> {
    try {
      const payload = typeof message === 'object' ? JSON.stringify(message) : String(message);
      return await CacheService.getClient().publish(channel, payload);
    } catch (err: any) {
      logger.error('PubSub publish error', { err: err.message, channel });
      throw err;
    }
  },

  async subscribe(channel: string, handler: ChannelHandler): Promise<void> {
    if (subscriptions.has(channel)) {
      logger.warn('Channel already subscribed', { channel });
      return;
    }

    const subscriber = CacheService.getClient().duplicate();
    await subscriber.subscribe(channel);

    subscriber.on('message', async (ch: string, message: string) => {
      if (ch === channel) {
        try {
          await handler(ch, message);
        } catch (err: any) {
          logger.error('PubSub handler error', { err: err.message, channel, message });
        }
      }
    });

    subscriber.on('error', (err: Error) => logger.error('PubSub subscriber error', { err: err.message, channel }));

    subscriptions.set(channel, { channel, handler, subscriber });
    logger.info('Subscribed to channel', { channel });
  },

  async unsubscribe(channel: string): Promise<void> {
    const sub = subscriptions.get(channel);
    if (sub) {
      await sub.subscriber.unsubscribe(channel);
      await sub.subscriber.quit();
      subscriptions.delete(channel);
      logger.info('Unsubscribed from channel', { channel });
    }
  },

  async unsubscribeAll(): Promise<void> {
    for (const [channel, sub] of subscriptions) {
      await sub.subscriber.unsubscribe(channel);
      await sub.subscriber.quit();
    }
    subscriptions.clear();
    logger.info('Unsubscribed from all channels');
  },

  getSubscriptions(): string[] {
    return Array.from(subscriptions.keys());
  },
};

export const PubSubChannels = {
  NOTIFICATIONS: 'notifications',
  ORDER_UPDATES: 'order_updates',
  USER_SESSIONS: 'user_sessions',
  INVENTORY_SYNC: 'inventory_sync',
};