import React, { useState, useEffect } from 'react';
import { Rate, Button, Input, notification, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ReviewService } from '../../services/product/reviewService';
import { useAuth } from '../../contexts/AuthContext';
import { Review } from '../../types';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await ReviewService.getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải đánh giá',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để đánh giá',
        placement: 'topRight',
        duration: 2,
      });
      return;
    }

    if (!comment.trim()) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng nhập nội dung đánh giá',
        placement: 'topRight',
        duration: 2,
      });
      return;
    }

    setSubmitting(true);
    try {
      await ReviewService.createReview({
        productId,
        rating,
        comment: comment.trim()
      });
      notification.success({
        message: 'Thành công',
        description: 'Đánh giá thành công',
        placement: 'topRight',
        duration: 2,
      });
      setComment('');
      fetchReviews();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể gửi đánh giá',
        placement: 'topRight',
        duration: 2,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await ReviewService.deleteReview(reviewId);
      notification.success({
        message: 'Thành công',
        description: 'Xóa đánh giá thành công',
        placement: 'topRight',
        duration: 2,
      });
      fetchReviews();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xóa đánh giá',
        placement: 'topRight',
        duration: 2,
      });
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