import React, { useEffect, useState } from 'react';
import { Card, Rate, Button, Tag, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import WishlistButton from './WishlistButton';
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
            className="product-card"
            cover={
              <img
                alt={product.name}
                src={product.imageUrl || 'https://via.placeholder.com/400'}
                className="h-48 object-cover"
                onClick={() => handleProductClick(product.id)}
              />
            }
            onClick={() => handleProductClick(product.id)}
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