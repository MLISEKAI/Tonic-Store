import { Category, Product } from '../../types';
import { ENDPOINTS, handleResponse } from '../api';

export const CategoryService = {
  // Lấy danh sách danh mục
  async getCategories(): Promise<Category[]> {
    const response = await fetch(ENDPOINTS.CATEGORY.LIST);
    return handleResponse(response);
  },

  // Lấy chi tiết danh mục
  async getCategory(id: string): Promise<Category> {
    const response = await fetch(ENDPOINTS.CATEGORY.DETAIL(id));
    return handleResponse(response);
  },

  // Lấy sản phẩm theo danh mục
  async getCategoryProducts(id: string, page = 1, limit = 10): Promise<{ products: Product[]; total: number }> {
    const response = await fetch(
      `${ENDPOINTS.CATEGORY.PRODUCTS(id)}?page=${page}&limit=${limit}`
    );
    return handleResponse(response);
  },
}; 