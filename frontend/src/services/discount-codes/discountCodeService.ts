import { PromotionCode, ValidatePromotionResponse } from '../../types';
import { API_URL, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const PromotionService = {
  // Lấy danh sách mã giảm giá có sẵn
  async getAvailablePromotionCodes(): Promise<PromotionCode[]> {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy danh sách mã giảm giá đã nhận
  async getClaimedPromotionCodes(): Promise<PromotionCode[]> {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/claimed`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Kiểm tra mã giảm giá có hợp lệ không
  async validatePromotionCode(code: string): Promise<ValidatePromotionResponse> {
    if (!code) return { isValid: false, message: 'Mã giảm giá không được để trống' };

    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code: code.trim() })
    });

    const data = await handleResponse(response);
    return {
      isValid: data.isValid ?? true,
      discountCode: data.discountCode,
      message: data.message
    };
  },

  // Nhận mã giảm giá
  async claimPromotionCode(code: string): Promise<ValidatePromotionResponse> {
    if (!code) return { isValid: false, message: 'Mã giảm giá không được để trống' };

    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/claim`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code: code.trim() })
    });

    const data = await handleResponse(response);
    return {
      isValid: data.isValid ?? true,
      discountCode: data.discountCode,
      message: data.message
    };
  },

  // Áp dụng mã giảm giá khi đặt hàng
  async applyPromotionCode(code: string, orderValue: number): Promise<ValidatePromotionResponse> {
    if (!code) return { isValid: false, message: 'Mã giảm giá không được để trống' };
    if (!orderValue || orderValue <= 0) return { isValid: false, message: 'Giá trị đơn hàng không hợp lệ' };

    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code: code.trim(), orderValue })
    });

    const data = await handleResponse(response);
    return {
      isValid: data.isValid ?? true,
      discountCode: data.discountCode,
      discountAmount: data.discountAmount,
      message: data.message
    };
  }
};