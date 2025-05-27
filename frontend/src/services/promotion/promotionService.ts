import { API_URL } from '../api';

export interface PromotionCode {
  id: string;
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const PromotionService = {
  // Lấy danh sách mã giảm giá đang có hiệu lực
  async getAvailablePromotionCodes(): Promise<PromotionCode[]> {
    try {
      const response = await fetch(`${API_URL}/promotion-codes/available`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch promotion codes');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching promotion codes:', error);
      throw error;
    }
  },

  // Kiểm tra mã giảm giá có hợp lệ không
  async validatePromotionCode(code: string, orderValue: number): Promise<{
    isValid: boolean;
    discount: number;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/promotion-codes/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ code, orderValue })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to validate promotion code');
      }

      return response.json();
    } catch (error) {
      console.error('Error validating promotion code:', error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết của một mã giảm giá
  async getPromotionCodeDetails(code: string): Promise<PromotionCode> {
    try {
      const response = await fetch(`${API_URL}/promotion-codes/${code}`, {
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch promotion code details');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching promotion code details:', error);
      throw error;
    }
  }
}; 