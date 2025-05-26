import { ENDPOINTS, handleResponse } from '../api';

export const SearchService = {
  // Tìm kiếm sản phẩm
  async searchProducts(query: string, page = 1, limit = 10, filters = {}) {
    const response = await fetch(
      `${ENDPOINTS.SEARCH.PRODUCTS}?q=${query}&page=${page}&limit=${limit}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      }
    );
    return handleResponse(response);
  },

  // Tìm kiếm đơn hàng
  async searchOrders(query: string, page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.SEARCH.ORDERS}?q=${query}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Lấy gợi ý tìm kiếm
  async getSearchSuggestions(query: string) {
    const response = await fetch(`${ENDPOINTS.SEARCH.SUGGESTIONS}?q=${query}`);
    return handleResponse(response);
  },

  // Lấy lịch sử tìm kiếm
  async getSearchHistory() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SEARCH.HISTORY, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Xóa lịch sử tìm kiếm
  async clearSearchHistory() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.SEARCH.HISTORY, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
}; 