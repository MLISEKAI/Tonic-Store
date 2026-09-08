import { Router, Request, Response } from 'express';
import { getRecentLogs, getSlowLogs, getCacheStats, clearLogs } from '../middleware/request-logger';
import { CacheService } from '../services/cache.service';
import { authenticate, requireAdmin } from '../middleware/auth';
import { getPerformanceReport } from '../services/performance-analyzer';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';

const router = Router();

router.get('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const method = req.query.method as string;
    const minDuration = parseFloat(req.query.minDuration as string) || 0;
    const statusCode = parseInt(req.query.statusCode as string);

    let logs = getRecentLogs(1000);

    if (method) {
      logs = logs.filter(l => l.method.toUpperCase() === method.toUpperCase());
    }
    if (statusCode) {
      logs = logs.filter(l => l.statusCode === statusCode);
    }
    if (minDuration > 0) {
      logs = logs.filter(l => l.duration >= minDuration);
    }

    res.apiSuccess({
      total: logs.length,
      logs: logs.slice(-limit),
    }, "Lấy danh sách log thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/logs");
  }
});

router.get('/slow', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 1000;
    const logs = getSlowLogs(threshold);
    res.apiSuccess({
      threshold,
      total: logs.length,
      logs,
    }, "Lấy danh sách log chậm thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/logs/slow");
  }
});

router.get('/stats', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const cacheStats = getCacheStats();
    const cacheMetrics = CacheService.getMetrics();

    res.apiSuccess({
      requestCache: cacheStats,
      redisCache: cacheMetrics,
      redisAvailable: process.env.REDIS_HOST ? true : false,
    }, "Lấy thống kê cache thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/logs/stats");
  }
});

router.delete('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    clearLogs();
    CacheService.resetMetrics();
    res.apiSuccess(null, "Xóa log thành công");
  } catch (error) {
    handleControllerError(res, error, "DELETE /api/logs");
  }
});

router.get('/performance', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const report = getPerformanceReport();
    res.apiSuccess(report, "Lấy báo cáo performance thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/logs/performance");
  }
});

router.get('/endpoints', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const logs = getRecentLogs(1000);
    const endpointMap = new Map<string, { count: number; totalDuration: number; maxDuration: number; errors: number }>();

    for (const log of logs) {
      const key = `${log.method} ${log.url.split('?')[0]}`;
      const existing = endpointMap.get(key);
      if (existing) {
        existing.count++;
        existing.totalDuration += log.duration;
        existing.maxDuration = Math.max(existing.maxDuration, log.duration);
        if (log.statusCode >= 400) existing.errors++;
      } else {
        endpointMap.set(key, {
          count: 1,
          totalDuration: log.duration,
          maxDuration: log.duration,
          errors: log.statusCode >= 400 ? 1 : 0,
        });
      }
    }

    const endpoints = Array.from(endpointMap.entries()).map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      avgDuration: Math.round((stats.totalDuration / stats.count) * 100) / 100,
      maxDuration: Math.round(stats.maxDuration * 100) / 100,
      errors: stats.errors,
      status: stats.totalDuration / stats.count > 200 ? 'SLOW' : 'OK',
    })).sort((a, b) => b.avgDuration - a.avgDuration);

    res.apiSuccess({
      total: endpoints.length,
      slow: endpoints.filter(e => e.status === 'SLOW').length,
      endpoints,
    }, "Lấy thống kê endpoint thành công");
  } catch (error) {
    handleControllerError(res, error, "GET /api/logs/endpoints");
  }
});

export default router;
