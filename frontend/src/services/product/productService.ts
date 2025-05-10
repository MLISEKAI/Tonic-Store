export const API_URL = import.meta.env.VITE_API_URL;

export const ProductService = {
  // Lấy danh sách sản phẩm
  async getProducts(category?: string) {
    const url = new URL(`${API_URL}/products`);
    if (category) {
      url.searchParams.append('category', category);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch products');
    }
    return response.json();
  },

  // Lấy chi tiết sản phẩm
  async getProduct(id: number) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string) {
    try {
      const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      return response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Tăng lượt xem sản phẩm
  async incrementProductView(id: number) {
    const response = await fetch(`${API_URL}/products/${id}/view`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to increment view');
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
  },

  // Lấy sản phẩm khuyến mãi
  async getFlashSaleProducts() {
    const response = await fetch(`${API_URL}/products/flash-sale`);
    if (!response.ok) throw new Error('Failed to fetch flash sale products');
    return response.json();
  }
}; 