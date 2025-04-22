import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, notification, Spin, Image, Rate, InputNumber, Tabs, Tag, Space, Divider } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined, StarOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';

const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
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
        if (id) {
          const data = await api.getProduct(parseInt(id));
          setProduct(data);
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!token) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, quantity);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Thêm sản phẩm vào giỏ hàng thất bại',
        placement: 'topRight',
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
      <div className="flex justify-center items-center min-h-screen">
        <Card>
          <h2>Sản phẩm không tồn tại</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <Space>
              {product.isNew && <Tag color="blue">Mới</Tag>}
              {product.isBestSeller && <Tag color="red">Bán chạy</Tag>}
              {product.isFeatured && <Tag color="gold">Nổi bật</Tag>}
            </Space>
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <Rate disabled defaultValue={product.rating || 0} />
            <span className="ml-2 text-gray-500">({product.rating || 0})</span>
            <span className="ml-4 text-gray-500">
              <EyeOutlined className="mr-1" />
              {product.viewCount} lượt xem
            </span>
            <span className="ml-4 text-gray-500">
              <FireOutlined className="mr-1" />
              {product.soldCount} đã bán
            </span>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <Divider />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.sku && (
                <div>
                  <span className="text-gray-500">Mã sản phẩm:</span>
                  <span className="ml-2">{product.sku}</span>
                </div>
              )}
              {product.barcode && (
                <div>
                  <span className="text-gray-500">Mã vạch:</span>
                  <span className="ml-2">{product.barcode}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-gray-500">Trọng lượng:</span>
                  <span className="ml-2">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="text-gray-500">Kích thước:</span>
                  <span className="ml-2">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div>
                  <span className="text-gray-500">Chất liệu:</span>
                  <span className="ml-2">{product.material}</span>
                </div>
              )}
              {product.origin && (
                <div>
                  <span className="text-gray-500">Xuất xứ:</span>
                  <span className="ml-2">{product.origin}</span>
                </div>
              )}
              {product.warranty && (
                <div>
                  <span className="text-gray-500">Bảo hành:</span>
                  <span className="ml-2">{product.warranty}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mb-6">
            <span className="mr-4">Số lượng:</span>
            <InputNumber
              min={1}
              max={product.stock || 10}
              defaultValue={1}
              onChange={(value) => setQuantity(value || 1)}
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              icon={<HeartOutlined />}
              size="large"
            >
              Yêu thích
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Mô tả sản phẩm" key="1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </TabPane>
          <TabPane tab="Đánh giá" key="2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Rate disabled defaultValue={product.rating || 0} />
                <span className="ml-2 text-gray-500">({product.rating || 0})</span>
                <span className="ml-4 text-gray-500">{product.reviewCount} đánh giá</span>
              </div>
              {/* Thêm danh sách đánh giá ở đây */}
            </div>
          </TabPane>
          <TabPane tab="Chính sách" key="3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Chính sách bán hàng</h3>
              <ul className="list-disc pl-6">
                <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
                <li>Đổi trả trong vòng 7 ngày</li>
                <li>Bảo hành theo chính sách của nhà sản xuất</li>
              </ul>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage; 