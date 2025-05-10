import React, { useEffect, useState } from 'react';
import { Card, Button, notification } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistService } from '../../services/wishlist/wishlistService';
import { ProductService } from '../../services/product/productService';

const FlashSale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getFlashSaleProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải sản phẩm flash sale',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddToWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào yêu thích',
        placement: 'topRight',
      });
      navigate('/login');
      return;
    }

    try {
      await WishlistService.addToWishlist(productId);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào yêu thích',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào yêu thích',
        placement: 'topRight',
      });
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Flash Sale</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.imageUrl}
                className="h-48 object-cover cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              />
            }
            actions={[
              <Button
                key="cart"
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(product)}
              >
                Thêm vào giỏ
              </Button>,
              <Button
                key="wishlist"
                icon={<HeartOutlined />}
                onClick={() => handleAddToWishlist(product.id)}
              >
                Yêu thích
              </Button>
            ]}
          >
            <Card.Meta
              title={
                <div 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.name}
                </div>
              }
              description={
                <div>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-red-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlashSale; 