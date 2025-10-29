import * as productService from './productService';

describe('productService', () => {
  it('getAllProducts nên trả về array (có thể empty)', async () => {
    const result = await productService.getAllProducts();
    expect(Array.isArray(result)).toBe(true);
  });
});
