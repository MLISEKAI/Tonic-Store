import { ENDPOINTS, handleResponse } from '../api';

export const StatsService = {
  // Lấy thống kê tổng quan
  async getStats() {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.STATS.OVERVIEW, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  // Lấy thống kê doanh số theo ngày
  async getSalesByDate(startDate: string, endDate: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.STATS.SALES}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return handleResponse(response);
  },

  // Lấy danh sách khách hàng mua nhiều nhất
  async getTopCustomers(limit: number = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      ENDPOINTS.STATS.TOP_CUSTOMERS(limit),
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return handleResponse(response);
  }
}; 