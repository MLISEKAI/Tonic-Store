import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, notification, Spin, Image, Rate, InputNumber, Tabs, Tag, Space, Divider } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined, StarOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import * as api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Product, ProductStatus } from '../../types';
import ProductReviews from './ProductReviews';

const { TabPane } = Tabs;

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { token } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (productId) {
          const data = await api.getProduct(parseInt(productId));
          setProduct(data);
          await api.incrementProductView(parseInt(productId));
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product!, quantity);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-red-500">Không tìm thấy sản phẩm</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="rounded-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <Rate disabled defaultValue={product.rating || 0} />
            <span className="ml-2 text-gray-500">
              ({product.reviewCount} đánh giá)
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-red-500">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-gray-500 line-through">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="mb-4">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Số lượng:</span>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
              />
              <span className="text-gray-500">
                {product.stock} sản phẩm có sẵn
              </span>
            </div>
          </div>

          <div className="flex space-x-4 mb-8">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={product.status === ProductStatus.OUT_OF_STOCK}
            >
              {product.status === ProductStatus.OUT_OF_STOCK ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </Button>
            <Button
              size="large"
              icon={<HeartOutlined />}
            >
              Yêu thích
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <EyeOutlined className="text-gray-500 mr-2" />
              <span className="text-gray-500">
                {product.viewCount} lượt xem
              </span>
            </div>
            <div className="flex items-center">
              <FireOutlined className="text-gray-500 mr-2" />
              <span className="text-gray-500">
                {product.soldCount} đã bán
              </span>
            </div>
            {product.isFeatured && (
              <div className="flex items-center">
                <StarOutlined className="text-yellow-500 mr-2" />
                <span className="text-yellow-500">Sản phẩm nổi bật</span>
              </div>
            )}
            {product.isNew && (
              <div className="flex items-center">
                <GiftOutlined className="text-blue-500 mr-2" />
                <span className="text-blue-500">Sản phẩm mới</span>
              </div>
            )}
            {product.isBestSeller && (
              <div className="flex items-center">
                <FireOutlined className="text-red-500 mr-2" />
                <span className="text-red-500">Bán chạy nhất</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Mô tả sản phẩm" key="1">
            <div className="prose max-w-none">
              {product.description}
            </div>
          </TabPane>
          <TabPane tab="Thông số kỹ thuật" key="2">
            <div className="space-y-4">
              {product.sku && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Mã sản phẩm:</span>
                  <span>{product.sku}</span>
                </div>
              )}
              {product.barcode && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Mã vạch:</span>
                  <span>{product.barcode}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Khối lượng:</span>
                  <span>{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Kích thước:</span>
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Chất liệu:</span>
                  <span>{product.material}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Xuất xứ:</span>
                  <span>{product.origin}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex">
                  <span className="w-1/3 font-medium">Bảo hành:</span>
                  <span>{product.warranty}</span>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab="Đánh giá" key="3">
            <ProductReviews productId={product.id} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail; 