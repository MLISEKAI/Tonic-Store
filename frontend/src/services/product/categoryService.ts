import { ENDPOINTS, handleResponse } from '../api';

export const CategoryService = {
  // Lấy danh sách danh mục
  async getCategories() {
    const response = await fetch(ENDPOINTS.CATEGORY.LIST);
    return handleResponse(response);
  },

  // Lấy chi tiết danh mục
  async getCategory(id: string) {
    const response = await fetch(ENDPOINTS.CATEGORY.DETAIL(id));
    return handleResponse(response);
  },

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId: string, page = 1, limit = 10) {
    const response = await fetch(
      `${ENDPOINTS.CATEGORY.PRODUCTS(categoryId)}?page=${page}&limit=${limit}`
    );
    return handleResponse(response);
  }
}; 