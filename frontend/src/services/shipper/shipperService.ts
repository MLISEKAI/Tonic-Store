import { ENDPOINTS, handleResponse } from '../api';

export const ShipperService = {
  // Lấy danh sách đơn hàng cần giao
  async getDeliveryOrders(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    try {
      console.log('Fetching delivery orders with params:', { page, limit });
      console.log('Using token:', token.substring(0, 10) + '...');

      const url = `${ENDPOINTS.ORDER.DELIVERY_LIST}?page=${page}&limit=${limit}`;
      console.log('Request URL:', url);

      // Log request details for debugging
      console.log('Request details:', {
        method: 'GET',
        url,
        headers: {
          'Authorization': `Bearer ${token.substring(0, 10)}...`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = 'Failed to fetch delivery orders';
        let errorData;
        
        try {
          errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }

        // Handle specific error cases
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to access delivery orders.');
        }
        if (response.status === 500) {
          // Log detailed error information
          console.error('Server error details:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            errorData
          });
          
          // Try to get more specific error message
          if (errorData?.details) {
            throw new Error(`Server error: ${errorData.details}. Please try again later or contact support.`);
          }
          if (errorData?.stack) {
            console.error('Server error stack:', errorData.stack);
          }
          
          throw new Error(`Server error: ${errorMessage}. Please try again later or contact support.`);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Successfully fetched orders:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching delivery orders:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Handle server errors
      if (error.message.includes('Server error')) {
        console.error('Server error occurred:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      throw new Error(error.message || 'Failed to fetch delivery orders. Please try again later.');
    }
  },

  // Cập nhật trạng thái giao hàng
  async updateDeliveryStatus(orderId: number, status: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${ENDPOINTS.ORDER.DELIVERY_STATUS(orderId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng
  async getDeliveryHistory(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_HISTORY}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Lấy lịch sử giao hàng của một đơn hàng
  async getOrderDeliveryLogs(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_LOGS(orderId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Lấy đánh giá shipper của một đơn hàng
  async getShipperRating(orderId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_RATING(orderId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return handleResponse(response);
  },

  // Đánh giá shipper
  async rateShipper(orderId: number, rating: number, comment?: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${ENDPOINTS.ORDER.DELIVERY_RATING(orderId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      }
    );
    return handleResponse(response);
  }
}; 