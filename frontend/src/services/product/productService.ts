import { ENDPOINTS, handleResponse } from '../api';

export const ProductService = {
  // Lấy danh sách sản phẩm
  async getProducts(p0: string | undefined) {
    const response = await fetch(ENDPOINTS.PRODUCT.LIST);
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
    const response = await fetch(`${ENDPOINTS.PRODUCT.SEARCH}?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  // Tăng lượt xem sản phẩm
  async incrementProductView(id: number) {
    const response = await fetch(ENDPOINTS.PRODUCT.VIEW(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
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