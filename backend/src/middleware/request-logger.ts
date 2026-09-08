import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import logger from '../config/logger';

export interface RequestLog {
  traceId: string;
  method: string;
  url: string;
  originalUrl: string;
  statusCode: number;
  duration: number;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  userId?: number;
  cacheStatus?: string;
  error?: string;
  query?: Record<string, any>;
}

const MAX_LOGS = 1000;
const logs: RequestLog[] = [];
const cacheStats = { hits: 0, misses: 0, errors: 0 };

const LOG_DIR = process.env.LOG_DIR ? join(process.env.LOG_DIR) : join(process.cwd(), 'logs');
const LOG_FILE = join(LOG_DIR, 'api-logs.json');

function loadLogsFromFile() {
  try {
    if (!existsSync(LOG_DIR)) {
      mkdirSync(LOG_DIR, { recursive: true });
    }
    if (existsSync(LOG_FILE)) {
      const data = readFileSync(LOG_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        logs.push(...parsed.slice(-MAX_LOGS));
        logger.info(`Loaded ${logs.length} logs from file`);
      }
    }
  } catch (error) {
    logger.warn('Failed to load logs from file:', error);
  }
}

function saveLogsToFile() {
  try {
    if (!existsSync(LOG_DIR)) {
      mkdirSync(LOG_DIR, { recursive: true });
    }
    writeFileSync(LOG_FILE, JSON.stringify(logs.slice(-MAX_LOGS), null, 2));
  } catch (error) {
    logger.warn('Failed to save logs to file:', error);
  }
}

loadLogsFromFile();

setInterval(() => {
  if (logs.length > 0) {
    saveLogsToFile();
  }
}, 30_000);

export function getRecentLogs(limit = 100): RequestLog[] {
  return logs.slice(-limit);
}

export function getSlowLogs(thresholdMs = 1000): RequestLog[] {
  return logs.filter(l => l.duration >= thresholdMs);
}

export function getCacheStats() {
  const total = cacheStats.hits + cacheStats.misses;
  return {
    ...cacheStats,
    total,
    hitRate: total > 0 ? ((cacheStats.hits / total) * 100).toFixed(2) + '%' : '0%',
  };
}

export function incrementCacheHit() { cacheStats.hits++; }
export function incrementCacheMiss() { cacheStats.misses++; }
export function incrementCacheError() { cacheStats.errors++; }

export function clearLogs() {
  logs.length = 0;
  saveLogsToFile();
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const traceId = randomUUID();
  const startTime = process.hrtime.bigint();
  const timestamp = new Date().toISOString();

  (req as any).traceId = traceId;
  res.setHeader('X-Trace-Id', traceId);

  const originalEnd = res.end;
  res.end = function (this: Response, ...args: any[]) {
    const duration = Number(process.hrtime.bigint() - startTime) / 1e6;
    const cacheStatus = res.getHeader('X-Cache') as string | undefined;

    const log: RequestLog = {
      traceId,
      method: req.method,
      url: req.originalUrl,
      originalUrl: req.originalUrl,
      statusCode: res.statusCode,
      duration: Math.round(duration * 100) / 100,
      timestamp,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
      cacheStatus: cacheStatus || undefined,
      query: Object.keys(req.query).length > 0 ? req.query as Record<string, any> : undefined,
    };

    if (res.statusCode >= 400) {
      log.error = `HTTP ${res.statusCode}`;
    }

    logs.push(log);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }

    saveLogsToFile();

    if (duration > 3000) {
      logger.warn('SLOW REQUEST', { traceId, method: req.method, url: req.originalUrl, duration: log.duration });
    } else if (duration > 1000) {
      logger.info('SLOW REQUEST', { traceId, method: req.method, url: req.originalUrl, duration: log.duration });
    }

    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger[level]('API', {
      traceId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${log.duration}ms (${(log.duration / 1000).toFixed(3)}s)`,
      cache: cacheStatus || 'N/A',
    });

    return originalEnd.apply(this, args as any);
  };

  next();
}
