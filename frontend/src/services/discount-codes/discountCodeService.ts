import { API_URL } from '../api';

export interface PromotionCode {
  id: number;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface ValidatePromotionResponse {
  isValid: boolean;
  discountCode?: PromotionCode;
  discountAmount?: number;
  message?: string;
}

export const PromotionService = {
  // Lấy danh sách mã giảm giá có sẵn
  getAvailablePromotionCodes: async (): Promise<PromotionCode[]> => {
    try {
      const response = await fetch(`${API_URL}/discount-codes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch promotion codes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching promotion codes:', error);
      throw error;
    }
  },

  // Lấy danh sách mã giảm giá đã nhận
  getClaimedPromotionCodes: async (): Promise<PromotionCode[]> => {
    try {
      const response = await fetch(`${API_URL}/discount-codes/claimed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch claimed promotion codes');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching claimed promotion codes:', error);
      throw error;
    }
  },

  // Kiểm tra mã giảm giá có tồn tại và có thể sử dụng không
  validatePromotionCode: async (code: string): Promise<ValidatePromotionResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          isValid: false,
          message: 'Vui lòng đăng nhập để sử dụng mã giảm giá'
        };
      }

      if (!code) {
        return {
          isValid: false,
          message: 'Mã giảm giá không được để trống'
        };
      }

      const response = await fetch(`${API_URL}/discount-codes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim()
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          isValid: false,
          message: data.message || 'Mã giảm giá không hợp lệ'
        };
      }
  
      return {
        isValid: true,
        discountCode: data.discountCode
      };
    } catch (error) {
      console.error('Error validating promotion code:', error);
      return {
        isValid: false,
        message: 'Không thể kiểm tra mã giảm giá'
      };
    }
  },

  // Nhận mã giảm giá
  claimPromotionCode: async (code: string): Promise<ValidatePromotionResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          isValid: false,
          message: 'Vui lòng đăng nhập để nhận mã giảm giá'
        };
      }

      if (!code) {
        return {
          isValid: false,
          message: 'Mã giảm giá không được để trống'
        };
      }

      const response = await fetch(`${API_URL}/discount-codes/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim()
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          isValid: false,
          message: data.message || 'Không thể nhận mã giảm giá'
        };
      }
  
      return {
        isValid: true,
        discountCode: data.discountCode
      };
    } catch (error) {
      console.error('Error claiming promotion code:', error);
      return {
        isValid: false,
        message: 'Không thể nhận mã giảm giá'
      };
    }
  },

  // Áp dụng mã giảm giá khi đặt hàng
  applyPromotionCode: async (code: string, orderValue: number): Promise<ValidatePromotionResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          isValid: false,
          message: 'Vui lòng đăng nhập để sử dụng mã giảm giá'
        };
      }

      if (!code) {
        return {
          isValid: false,
          message: 'Mã giảm giá không được để trống'
        };
      }

      if (!orderValue || orderValue <= 0) {
        return {
          isValid: false,
          message: 'Giá trị đơn hàng không hợp lệ'
        };
      }

      const response = await fetch(`${API_URL}/discount-codes/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.trim(),
          orderValue: Number(orderValue)
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return {
          isValid: false,
          message: data.message || 'Không thể áp dụng mã giảm giá'
        };
      }
  
      return {
        isValid: true,
        discountCode: data.discountCode,
        discountAmount: data.discountAmount
      };
    } catch (error) {
      console.error('Error applying promotion code:', error);
      return {
        isValid: false,
        message: 'Không thể áp dụng mã giảm giá'
      };
    }
  }
}; 