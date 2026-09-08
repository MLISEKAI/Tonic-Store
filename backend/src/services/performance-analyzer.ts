import { getRecentLogs } from '../middleware/request-logger';
import { CacheService } from './cache.service';

export interface OptimizationSuggestion {
  endpoint: string;
  currentDuration: number;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export function analyzePerformance(): OptimizationSuggestion[] {
  const logs = getRecentLogs(1000);
  const suggestions: OptimizationSuggestion[] = [];

  const endpointStats = new Map<string, { total: number; count: number; maxDuration: number }>();

  for (const log of logs) {
    const key = `${log.method} ${log.url.split('?')[0]}`;
    const existing = endpointStats.get(key);
    if (existing) {
      existing.total += log.duration;
      existing.count++;
      existing.maxDuration = Math.max(existing.maxDuration, log.duration);
    } else {
      endpointStats.set(key, { total: log.duration, count: 1, maxDuration: log.duration });
    }
  }

  for (const [endpoint, stats] of endpointStats) {
    const avgDuration = stats.total / stats.count;

    if (avgDuration > 200 || stats.maxDuration > 500) {
      const suggestion = getOptimizationSuggestion(endpoint, avgDuration, stats.maxDuration);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
  }

  return suggestions.sort((a, b) => b.currentDuration - a.currentDuration);
}

function getOptimizationSuggestion(endpoint: string, avg: number, max: number): OptimizationSuggestion | null {
  if (endpoint.includes('/products') && endpoint.includes('flash-sale')) {
    return {
      endpoint,
      currentDuration: avg,
      issue: 'Flash sale query có thể chậm do scan toàn bộ products',
      suggestion: 'Cache flash sale results với TTL 5 phút, dùng Redis sorted set cho特价商品',
      priority: 'high',
    };
  }

  if (endpoint.includes('/search')) {
    return {
      endpoint,
      currentDuration: avg,
      issue: 'Search query chậm do full-text search trên database',
      suggestion: 'Dùng Elasticsearch hoặc PostgreSQL full-text search với index, cache kết quả search phổ biến',
      priority: 'high',
    };
  }

  if (endpoint.includes('/stats')) {
    return {
      endpoint,
      currentDuration: avg,
      issue: 'Stats query aggregate nhiều tables',
      suggestion: 'Pre-compute stats định kỳ (daily/weekly), cache kết quả 10-15 phút',
      priority: 'high',
    };
  }

  if (endpoint.includes('/orders') && endpoint.includes('POST')) {
    return {
      endpoint,
      currentDuration: avg,
      issue: 'Order creation chậm do transaction dài',
      suggestion: 'Tách validation ra trước transaction, dùng optimistic locking, giảm DB queries',
      priority: 'medium',
    };
  }

  if (endpoint.includes('/wishlist')) {
    return {
      endpoint,
      currentDuration: avg,
      issue: 'Wishlist check N+1 queries',
      suggestion: 'Batch check wishlist status, cache kết quả theo user ID',
      priority: 'medium',
    };
  }

  if (avg > 300) {
    return {
      endpoint,
      currentDuration: avg,
      issue: `Response time ${avg.toFixed(0)}ms > 200ms`,
      suggestion: 'Kiểm tra N+1 queries, thêm cache, tối ưu SQL queries với index',
      priority: 'high',
    };
  }

  if (max > 500) {
    return {
      endpoint,
      currentDuration: avg,
      issue: `Peak response time ${max.toFixed(0)}ms`,
      suggestion: 'Kiểm tra cold start, connection pooling, hoặc concurrent requests',
      priority: 'medium',
    };
  }

  return null;
}

export function getPerformanceReport() {
  const suggestions = analyzePerformance();
  const cacheStats = CacheService.getMetrics();

  return {
    summary: {
      totalEndpoints: suggestions.length,
      highPriority: suggestions.filter(s => s.priority === 'high').length,
      mediumPriority: suggestions.filter(s => s.priority === 'medium').length,
    },
    cache: cacheStats,
    suggestions,
  };
}
