import { ENDPOINTS, handleResponse } from '../api';

export const ProductService = {
  // Lấy danh sách sản phẩm (lọc theo danh mục nếu có)
  async getProducts(category?: string) {
    const params = new URLSearchParams({ status: 'ACTIVE' });
    if (category) params.append('category', category);
    const response = await fetch(`${ENDPOINTS.PRODUCT.LIST}?${params.toString()}`);
    return handleResponse(response);
  },

  // Lấy chi tiết sản phẩm
  async getProductById(id: number) {
    const response = await fetch(ENDPOINTS.PRODUCT.DETAIL(id));
    return handleResponse(response);
  },

  // Lấy danh sách danh mục
  async getCategories() {
    const response = await fetch(ENDPOINTS.PRODUCT.CATEGORIES);
    return handleResponse(response);
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string) {
    const trimmed = query.trim();
    const response = await fetch(`${ENDPOINTS.PRODUCT.SEARCH}?q=${encodeURIComponent(trimmed)}`);
    return handleResponse(response);
  },

  // Tăng lượt xem sản phẩm
  async incrementProductView(id: number) {
    try {
      const response = await fetch(ENDPOINTS.PRODUCT.VIEW(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      return handleResponse(response);
    } catch (error) {
      console.warn('Failed to increment product view:', error);
    }
  },

  // Lấy sản phẩm nổi bật
  async getFeaturedProducts(limit = 8) {
    const response = await fetch(ENDPOINTS.PRODUCT.FEATURED(limit));
    return handleResponse(response);
  },

  // Lấy sản phẩm bán chạy
  async getBestSellingProducts(limit = 8) {
    const response = await fetch(ENDPOINTS.PRODUCT.BEST_SELLING(limit));
    return handleResponse(response);
  },

  // Lấy sản phẩm mới nhất
  async getNewestProducts(limit = 8) {
    const response = await fetch(ENDPOINTS.PRODUCT.NEWEST(limit));
    return handleResponse(response);
  },

  // Lấy sản phẩm flash sale
  async getFlashSaleProducts() {
    const response = await fetch(ENDPOINTS.PRODUCT.FLASH_SALE);
    return handleResponse(response);
  }
};
