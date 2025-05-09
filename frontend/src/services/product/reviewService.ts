export const API_URL = import.meta.env.VITE_API_URL;

export const ReviewService = {
  // Lấy đánh giá của sản phẩm
  async getProductReviews(productId: number) {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  // Tạo đánh giá mới
  async createReview(data: {
    productId: number;
    rating: number;
    comment: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  },

  // Cập nhật đánh giá
  async updateReview(reviewId: number, data: {
    rating?: number;
    comment?: string;
  }) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
  },

  // Xóa đánh giá
  async deleteReview(reviewId: number) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  }
}; 