import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const StatsService = {
  // Lấy thống kê tổng quan
  async getStats() {
    const response = await fetchWithCredentials(ENDPOINTS.STATS.OVERVIEW, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy thống kê doanh số theo ngày
  async getSalesByDate(startDate: string, endDate: string) {
    const response = await fetchWithCredentials(
      `${ENDPOINTS.STATS.SALES}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: getHeaders()
      }
    );
    return handleResponse(response);
  },

  // Lấy danh sách khách hàng mua nhiều nhất
  async getTopCustomers(limit: number = 10) {
    const response = await fetchWithCredentials(
      ENDPOINTS.STATS.TOP_CUSTOMERS(limit),
      {
        headers: getHeaders()
      }
    );
    return handleResponse(response);
  }
};