import { API_URL } from '../api';

export const CategoryService = {
  // Lấy danh sách danh mục
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Lấy chi tiết danh mục
  async getCategory(id: string) {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId: string, page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/categories/${categoryId}/products?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }
}; 