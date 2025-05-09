export const API_URL = import.meta.env.VITE_API_URL;

export const CategoryService = {
  // Lấy danh sách danh mục
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Lấy chi tiết danh mục
  async getCategory(id: number) {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch category');
    }
    return response.json();
  },

  // Lấy sản phẩm theo danh mục
  async getCategoryProducts(id: number, page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/categories/${id}/products?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch category products');
    return response.json();
  }
}; 