import { useState, useEffect } from 'react';
import { Card, Rate, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Review, Product } from '../../types';
import { ReviewService } from '../../services/product/reviewService';
import { ProductService } from '../../services/product/productService';

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setError(null);
      // Lấy danh sách sản phẩm
      const products = await ProductService.getProducts(undefined);
      
      // Lấy reviews của các sản phẩm
      const allReviewsPromises = products.map((product: Product) => 
        ReviewService.getProductReviews(product.id)
      );
      
      const allReviewsArrays = await Promise.all(allReviewsPromises);
      
      // Gộp và sắp xếp reviews theo thời gian mới nhất
      const allReviews = allReviewsArrays
        .flat()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3); // Chỉ lấy 3 đánh giá mới nhất
      
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Không thể tải đánh giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchWithRetry = async () => {
      if (!isMounted) return;
      
      try {
        await fetchReviews();
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          // Exponential backoff: 5s, 10s, 20s
          const delay = Math.min(5000 * Math.pow(2, retryCount - 1), 20000);
          setTimeout(fetchWithRetry, delay);
        }
      }
    };

    // Tải dữ liệu lần đầu
    fetchWithRetry();

    // Cập nhật dữ liệu mỗi 60 giây
    const intervalId = setInterval(fetchWithRetry, 60000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-12">Khách hàng nói gì về chúng tôi?</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="hover:shadow-lg transition-shadow duration-300 bg-white h-full"
              >
                <div className="flex items-center mb-4">
                  <Avatar icon={<UserOutlined />} className="mr-4" size={64} />
                  <div>
                    <h3 className="font-semibold text-xl">{review.user?.name || 'Ẩn danh'}</h3>
                    <Rate disabled defaultValue={review.rating} className="text-lg" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-lg italic">"{review.comment}"</p>
                <p className="text-gray-400 text-sm">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 