import Redis from 'ioredis';
import logger from '../config/logger';

export type CacheValue = string | number | boolean | object | null;

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

const DEFAULT_PREFIX = process.env.NODE_ENV || 'development';
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  lazyConnect: true,
});

redis.on('error', (err) => logger.error('Redis connection error', { err: err.message }));
redis.on('connect', () => logger.info('Redis connected'));

let connected = false;
let redisAvailable = false;

export async function connectRedis() {
  if (connected) return;
  try {
    await redis.connect();
    connected = true;
    redisAvailable = true;
  } catch (err: any) {
    logger.warn('Redis not available, running without cache', { err: err.message });
    redisAvailable = false;
  }
}

export async function disconnectRedis() {
  if (connected) {
    await redis.quit();
    connected = false;
    redisAvailable = false;
  }
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

function buildKey(key: string, prefix = DEFAULT_PREFIX): string {
  return `${prefix}:${key}`;
}

export const CacheService = {
  async set(key: string, value: CacheValue, ttl?: number, prefix?: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const fullKey = buildKey(key, prefix);
      if (ttl) {
        await redis.set(fullKey, serialized, 'EX', ttl);
      } else {
        await redis.set(fullKey, serialized);
      }
    } catch (err: any) {
      logger.error('Cache set error', { err: err.message, key });
      throw err;
    }
  },

  async get<T = any>(key: string, prefix?: string): Promise<T | null> {
    if (!redisAvailable) return null;
    try {
      const fullKey = buildKey(key, prefix);
      const data = await redis.get(fullKey);
      if (!data) return null;
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as T;
      }
    } catch (err: any) {
      logger.error('Cache get error', { err: err.message, key });
      return null;
    }
  },

  async delete(key: string, prefix?: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      const fullKey = buildKey(key, prefix);
      await redis.del(fullKey);
    } catch (err: any) {
      logger.error('Cache delete error', { err: err.message, key });
    }
  },

  async exists(key: string, prefix?: string): Promise<boolean> {
    if (!redisAvailable) return false;
    try {
      const fullKey = buildKey(key, prefix);
      return (await redis.exists(fullKey)) === 1;
    } catch {
      return false;
    }
  },

  async increment(key: string, ttl?: number, prefix?: string): Promise<number> {
    if (!redisAvailable) return 0;
    try {
      const fullKey = buildKey(key, prefix);
      const val = await redis.incr(fullKey);
      if (ttl) await redis.expire(fullKey, ttl);
      return val;
    } catch (err: any) {
      logger.error('Cache increment error', { err: err.message, key });
      throw err;
    }
  },

  async setHash(key: string, data: Record<string, any>, ttl?: number, prefix?: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      const fullKey = buildKey(key, prefix);
      const pipeline = redis.pipeline();
      pipeline.hset(fullKey, data);
      if (ttl) pipeline.expire(fullKey, ttl);
      await pipeline.exec();
    } catch (err: any) {
      logger.error('Cache hset error', { err: err.message, key });
      throw err;
    }
  },

  async getHash<T = any>(key: string, prefix?: string): Promise<T | null> {
    if (!redisAvailable) return null;
    try {
      const fullKey = buildKey(key, prefix);
      const data = await redis.hgetall(fullKey);
      if (!data || Object.keys(data).length === 0) return null;
      return data as T;
    } catch (err: any) {
      logger.error('Cache hgetall error', { err: err.message, key });
      return null;
    }
  },

  getClient(): Redis {
    return redis;
  },
};

export const CacheKeys = {
  USER_SESSION: (userId: number) => `user:session:${userId}`,
  USER_PROFILE: (userId: number) => `user:profile:${userId}`,
  PRODUCT_LIST: (page: number, limit: number) => `products:list:${page}:${limit}`,
  CATEGORY_TREE: () => 'categories:tree',
};