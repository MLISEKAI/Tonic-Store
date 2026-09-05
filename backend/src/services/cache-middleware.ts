import type { Request, Response, NextFunction } from 'express';
import { CacheService, isRedisAvailable } from './cache.service';
import logger from '../config/logger';

export interface CacheMiddlewareOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
}

export function cacheMiddleware(options: CacheMiddlewareOptions) {
  const { ttl = 300, keyGenerator } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (!isRedisAvailable()) {
      next();
      return;
    }

    const cacheKey = keyGenerator ? keyGenerator(req) : `cache:${req.originalUrl}`;

    try {
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData !== null) {
        logger.debug('Cache HIT', { key: cacheKey, url: req.originalUrl });
        res.set('X-Cache', 'HIT');
        res.json(cachedData);
        return;
      }
    } catch (err: any) {
      logger.warn('Cache middleware read error', { err: err?.message, key: cacheKey });
    }

    logger.debug('Cache MISS', { key: cacheKey, url: req.originalUrl });
    res.set('X-Cache', 'MISS');

    const originalSend = res.send;
    res.send = function (body: any) {
      res.send = originalSend;

      try {
        const parsed = JSON.parse(body);
        CacheService.set(cacheKey, parsed, ttl).catch((err: any) => {
          logger.warn('Cache middleware write error', { err: err?.message, key: cacheKey });
        });
      } catch {
        CacheService.set(cacheKey, body, ttl).catch((err: any) => {
          logger.warn('Cache middleware write error', { err: err?.message, key: cacheKey });
        });
      }

      return originalSend.call(this, body);
    };

    next();
  };
}

export async function invalidateCachePatterns(patterns: string[]): Promise<void> {
  if (!isRedisAvailable()) return;
  for (const pattern of patterns) {
    await CacheService.deletePattern(pattern);
  }
}
