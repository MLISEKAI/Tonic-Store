import { API_URL, fetchWithCredentials, getHeaders, handleResponse } from './api';

export interface LogEntry {
  traceId: string;
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  timestamp: string;
  ip?: string;
  userId?: number;
  cacheStatus?: string;
  error?: string;
}

export interface EndpointStats {
  endpoint: string;
  count: number;
  avgDuration: number;
  maxDuration: number;
  errors: number;
  status: 'OK' | 'SLOW';
}

export interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  total: number;
  hitRate: string;
}

export interface PerformanceSuggestion {
  endpoint: string;
  currentDuration: number;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export const logService = {
  getLogs: async (params?: { limit?: number; method?: string; minDuration?: number; statusCode?: number }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.method) query.set('method', params.method);
    if (params?.minDuration) query.set('minDuration', String(params.minDuration));
    if (params?.statusCode) query.set('statusCode', String(params.statusCode));

    const response = await fetchWithCredentials(`${API_URL}/api/logs?${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(response) as Promise<{ total: number; logs: LogEntry[] }>;
  },

  getSlowLogs: async (threshold = 1000) => {
    const response = await fetchWithCredentials(`${API_URL}/api/logs/slow?threshold=${threshold}`, {
      headers: getHeaders(),
    });
    return handleResponse(response) as Promise<{ threshold: number; total: number; logs: LogEntry[] }>;
  },

  getStats: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/logs/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response) as Promise<{ requestCache: CacheStats; redisCache: any }>;
  },

  getEndpoints: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/logs/endpoints`, {
      headers: getHeaders(),
    });
    return handleResponse(response) as Promise<{ total: number; slow: number; endpoints: EndpointStats[] }>;
  },

  getPerformance: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/logs/performance`, {
      headers: getHeaders(),
    });
    return handleResponse(response) as Promise<{ summary: any; cache: any; suggestions: PerformanceSuggestion[] }>;
  },

  clearLogs: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/logs`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
