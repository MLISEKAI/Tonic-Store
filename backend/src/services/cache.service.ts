import Redis from 'ioredis';
import logger from '../config/logger';

export type CacheValue = string | number | boolean | object | null;

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

const DEFAULT_PREFIX = process.env.NODE_ENV || 'development';

const redisConfig: any = {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
  lazyConnect: true,
};

if (process.env.REDIS_URL) {
  redisConfig.url = process.env.REDIS_URL;
} else {
  redisConfig.host = process.env.REDIS_HOST || 'localhost';
  redisConfig.port = parseInt(process.env.REDIS_PORT || '6379');
  if (process.env.REDIS_PASSWORD) {
    redisConfig.password = process.env.REDIS_PASSWORD;
  }
}

if (process.env.REDIS_TLS === 'true') {
  redisConfig.tls = {};
}

const redis = new Redis(redisConfig);

let lastErrMsg = '';
redis.on('error', (err: any) => {
  const msg = err?.message || String(err);
  if (msg === lastErrMsg) return;
  lastErrMsg = msg;
  logger.warn('Redis connection error', { err: msg });
});
redis.on('connect', () => {
  lastErrMsg = '';
  logger.info('Redis connected');
});

let connected = false;
let redisAvailable = false;

export async function connectRedis() {
  if (connected) return;
  try {
    await redis.connect();
    connected = true;
    redisAvailable = true;
  } catch (err: any) {
    logger.warn('Redis not available, running without cache', { err: err?.message || String(err) });
    redisAvailable = false;
  }
}

export async function disconnectRedis() {
  if (connected) {
    try {
      await redis.quit();
    } catch (err: any) {
      logger.warn('Redis disconnect error', { err: err?.message });
    }
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
      logger.warn('Cache set error', { err: err?.message, key });
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
      logger.warn('Cache get error', { err: err?.message, key });
      return null;
    }
  },

  async delete(key: string, prefix?: string): Promise<void> {
    if (!redisAvailable) return;
    try {
      const fullKey = buildKey(key, prefix);
      await redis.del(fullKey);
    } catch (err: any) {
      logger.warn('Cache delete error', { err: err?.message });
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
      logger.warn('Cache increment error', { err: err?.message, key });
      return 0;
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
      logger.warn('Cache hset error', { err: err?.message });
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
      logger.warn('Cache hgetall error', { err: err?.message });
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