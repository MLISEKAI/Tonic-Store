import { API_URL } from '../api';

export const ReviewService = {
  // Lấy đánh giá của sản phẩm
  async getProductReviews(productId: string, page = 1, limit = 10) {
    const response = await fetch(
      `${API_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  // Thêm đánh giá mới
  async createReview(productId: string, data: {
    rating: number;
    comment: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  },

  // Xóa đánh giá
  async deleteReview(productId: string, reviewId: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/products/${productId}/reviews/${reviewId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  }
}; 