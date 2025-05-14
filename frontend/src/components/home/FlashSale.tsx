import React from 'react';
import { Card, Rate, Button, Tag, notification } from 'antd';
import { ShoppingCartOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import WishlistButton from './WishlistButton';
import { useFlashSale } from '../../hooks/useFlashSale';

const FlashSale: React.FC = () => {
  const { products, loading, error } = useFlashSale();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, 1);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
    }
  };

  const navigateToProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Flash Sale</h2>
        <Link
          to="/flash-sale"
          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
        >
          Xem tất cả <RightOutlined className="text-xs ml-1"/>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            className="product-card"
            cover={
              <img
                alt={product.name}
                src={product.imageUrl}
                className="h-48 object-cover"
                onClick={() => navigateToProduct(product.id)}
              />
            }
            onClick={() => navigateToProduct(product.id)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <div className="flex space-x-1">
                  {product.isNew && <Tag color="blue">Mới</Tag>}
                  {product.isFeatured && <Tag color="gold">Nổi bật</Tag>}
                  {product.isBestSeller && <Tag color="red">Bán chạy</Tag>}
                </div>
              </div>

              <div className="flex items-center">
                <Rate disabled defaultValue={product.rating || 0} />
                <span className="ml-2 text-gray-500 text-sm">
                  ({product.reviewCount || 0})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                {product.promotionalPrice && (
                  <span className="text-gray-500 line-through">
                    {formatPrice(product.promotionalPrice)}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">
                  Đã bán: {product.soldCount || 0}
                </span>
                <div className="flex space-x-2">
                  <WishlistButton productId={product.id} showText={false} className="!p-2" />
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.status === ProductStatus.OUT_OF_STOCK}
                  >
                    {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlashSale; 