import React, { useState, useEffect } from 'react';
import { Rate, Button, Input, message, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await api.getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      message.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (!comment.trim()) {
      message.warning('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      await api.createReview(token!, {
        productId,
        rating,
        comment: comment.trim()
      });
      message.success('Đánh giá thành công');
      setComment('');
      fetchReviews();
    } catch (error) {
      message.error('Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await api.deleteReview(token!, reviewId);
      message.success('Xóa đánh giá thành công');
      fetchReviews();
    } catch (error) {
      message.error('Không thể xóa đánh giá');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>

      {isAuthenticated && (
        <div className="mb-8">
          <div className="mb-4">
            <Rate value={rating} onChange={setRating} />
          </div>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập đánh giá của bạn..."
            className="mb-4"
          />
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!comment.trim()}
          >
            Gửi đánh giá
          </Button>
        </div>
      )}

      <List
        className="review-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={reviews}
        renderItem={(review) => (
          <div className="review-item p-4 border-b">
            <div className="flex items-start">
              <Avatar icon={<UserOutlined />} className="mr-4" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{review.user?.name}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <Rate disabled defaultValue={review.rating} className="my-2" />
                <p className="text-gray-700">{review.comment}</p>
                {isAuthenticated && review.userId === JSON.parse(localStorage.getItem('user') || '{}').id && (
                  <Button
                    type="link"
                    danger
                    onClick={() => handleDelete(review.id)}
                    className="mt-2"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ProductReviews; 