export const API_URL = import.meta.env.VITE_API_URL;

export const StatsService = {
  // Lấy thống kê tổng quan
  async getStats() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Lấy thống kê doanh số theo ngày
  async getSalesByDate(startDate: string, endDate: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/stats/sales?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch sales stats');
    return response.json();
  },

  // Lấy danh sách khách hàng mua nhiều nhất
  async getTopCustomers(limit: number = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/stats/top-customers?limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch top customers');
    return response.json();
  }
}; 