export const API_URL = import.meta.env.VITE_API_URL;

export const SearchService = {
  // Tìm kiếm sản phẩm
  async searchProducts(query: string, page = 1, limit = 10, filters = {}) {
    const response = await fetch(
      `${API_URL}/search/products?q=${query}&page=${page}&limit=${limit}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      }
    );
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  },

  // Tìm kiếm đơn hàng
  async searchOrders(query: string, page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/search/orders?q=${query}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to search orders');
    return response.json();
  },

  // Lấy gợi ý tìm kiếm
  async getSearchSuggestions(query: string) {
    const response = await fetch(`${API_URL}/search/suggestions?q=${query}`);
    if (!response.ok) throw new Error('Failed to get search suggestions');
    return response.json();
  },

  // Lấy lịch sử tìm kiếm
  async getSearchHistory() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/search/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to get search history');
    return response.json();
  },

  // Xóa lịch sử tìm kiếm
  async clearSearchHistory() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/search/history`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to clear search history');
    return response.json();
  }
}; 