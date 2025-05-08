import { API_URL } from '../api';

export const ProductService = {
  // Lấy danh sách sản phẩm
  async getProducts(page = 1, limit = 10, search = '', sort = '') {
    const response = await fetch(
      `${API_URL}/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}`
    );
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // Lấy chi tiết sản phẩm
  async getProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Lấy sản phẩm nổi bật
  async getFeaturedProducts(limit = 8) {
    const response = await fetch(`${API_URL}/products/featured?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    return response.json();
  },

  // Lấy sản phẩm bán chạy
  async getBestSellingProducts(limit = 8) {
    const response = await fetch(`${API_URL}/products/best-selling?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch best selling products');
    return response.json();
  },

  // Lấy sản phẩm mới nhất
  async getNewestProducts(limit = 8) {
    const response = await fetch(`${API_URL}/products/newest?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch newest products');
    return response.json();
  }
}; 