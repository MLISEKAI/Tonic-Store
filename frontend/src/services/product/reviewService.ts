import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export const ReviewService = {
  // Lấy đánh giá của sản phẩm
  async getProductReviews(productId: number) {
    const response = await fetch(ENDPOINTS.REVIEW.LIST(productId));
    return handleResponse(response);
  },

  // Tạo đánh giá mới
  async createReview(data: { productId: number; rating: number; comment: string }) {
    const response = await fetchWithCredentials(ENDPOINTS.REVIEW.CREATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật đánh giá
  async updateReview(reviewId: number, data: { rating?: number; comment?: string }) {
    const response = await fetchWithCredentials(ENDPOINTS.REVIEW.UPDATE(reviewId), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa đánh giá
  async deleteReview(reviewId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.REVIEW.DELETE(reviewId), {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};