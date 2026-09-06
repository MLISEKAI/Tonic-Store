import { Router, Request, Response } from 'express';
import { getRecentLogs, getSlowLogs, getCacheStats, clearLogs } from '../middleware/request-logger';
import { CacheService } from '../services/cache.service';
import { requireAdmin } from '../middleware/auth';
import { getPerformanceReport, analyzePerformance } from '../services/performance-analyzer';

const router = Router();

// GET /api/logs - Lấy danh sách log gần đây
router.get('/', requireAdmin, (req: Request, res: Response) => {
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

  res.json({
    total: logs.length,
    logs: logs.slice(-limit),
  });
});

// GET /api/logs/slow - Log các request chậm
router.get('/slow', requireAdmin, (req: Request, res: Response) => {
  const threshold = parseInt(req.query.threshold as string) || 1000;
  const logs = getSlowLogs(threshold);
  res.json({
    threshold,
    total: logs.length,
    logs,
  });
});

// GET /api/logs/stats - Thống kê cache hit/miss
router.get('/stats', requireAdmin, (req: Request, res: Response) => {
  const cacheStats = getCacheStats();
  const cacheMetrics = CacheService.getMetrics();

  res.json({
    requestCache: cacheStats,
    redisCache: cacheMetrics,
    redisAvailable: process.env.REDIS_HOST ? true : false,
  });
});

// DELETE /api/logs - Xóa log
router.delete('/', requireAdmin, (req: Request, res: Response) => {
  clearLogs();
  CacheService.resetMetrics();
  res.json({ message: 'Logs cleared' });
});

// GET /api/logs/performance - Phân tích performance và gợi ý tối ưu
router.get('/performance', requireAdmin, (req: Request, res: Response) => {
  const report = getPerformanceReport();
  res.json(report);
});

// GET /api/logs/endpoints - Thống kê response time theo endpoint
router.get('/endpoints', requireAdmin, (req: Request, res: Response) => {
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

  res.json({
    total: endpoints.length,
    slow: endpoints.filter(e => e.status === 'SLOW').length,
    endpoints,
  });
});

export default router;
