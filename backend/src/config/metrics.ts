import { register, Counter, Histogram } from 'prom-client';

// Reset default metrics
register.clear();

// Custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeUsers = new Counter({
  name: 'active_users_total',
  help: 'Total number of active users'
});

export const ordersTotal = new Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status']
});

export const productsTotal = new Counter({
  name: 'products_total',
  help: 'Total number of products',
  labelNames: ['category']
});

// Database metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const dbErrorsTotal = new Counter({
  name: 'db_errors_total',
  help: 'Total number of database errors',
  labelNames: ['error_type']
}); 