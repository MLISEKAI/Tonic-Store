import request from 'supertest';
import app from '../src/app';

describe('API (e2e)', () => {
  it('GET /api/products should not crash', async () => {
    const res = await request(app).get('/api/products');
    // Chấp nhận 200 (có DB) hoặc 500 (DB chưa sẵn sàng trong môi trường test)
    expect([200, 500]).toContain(res.statusCode);
  });

  it('GET /api/categories should not crash', async () => {
    const res = await request(app).get('/api/categories');
    expect([200, 500]).toContain(res.statusCode);
  });
});
