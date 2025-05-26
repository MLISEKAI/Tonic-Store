import { ENDPOINTS, handleResponse } from '../api';

export const ReviewService = {
  // Lấy đánh giá của sản phẩm
  async getProductReviews(productId: number) {
    const response = await fetch(ENDPOINTS.REVIEW.LIST(productId));
    return handleResponse(response);
  },

  // Tạo đánh giá mới
  async createReview(data: {
    productId: number;
    rating: number;
    comment: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.REVIEW.CREATE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Cập nhật đánh giá
  async updateReview(reviewId: number, data: {
    rating?: number;
    comment?: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.REVIEW.UPDATE(reviewId), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Xóa đánh giá
  async deleteReview(reviewId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(ENDPOINTS.REVIEW.DELETE(reviewId), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  }
}; 