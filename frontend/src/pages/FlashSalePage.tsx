import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Button, 
  Space, 
  Tag,
  Image,
  notification,
  Spin,
  Breadcrumb
} from 'antd';
import { 
  FireOutlined, 
  ClockCircleOutlined, 
  ShoppingCartOutlined,
  EyeOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { useFlashSale } from '../hooks/useFlashSale';
import WishlistButton from '../components/home/WishlistButton';
import { getBreadcrumbFromPath } from '../utils/breadcrumb';

const { Title, Text } = Typography;

// Countdown Timer Component
const CountdownTimer = ({ targetTime }: { targetTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[30px] text-center">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[30px] text-center">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[30px] text-center">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

// Flash Sale Product Card
const FlashSaleProductCard = ({ 
  product, 
  onAddToCart, 
  isAuthenticated 
}: { 
  product: Product; 
  onAddToCart: (product: Product) => void;
  isAuthenticated: boolean;
}) => {
  const navigate = useNavigate();
  
  const discountPercentage = product.promotionalPrice 
    ? Math.round(((product.price - product.promotionalPrice) / product.price) * 100)
    : 0;

  // const soldPercentage = product.soldCount 
  //   ? Math.min((product.soldCount / (product.stock || 100)) * 100, 100)
  //   : Math.random() * 80 + 10;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
      navigate('/login');
      return;
    }
    onAddToCart(product);
  };

  return (
    <Card
      hoverable
      className="h-full relative overflow-hidden"
      onClick={() => navigate(`/products/${product.id}`, { 
        state: { fromMenu: 'flash-sale' } 
      })}
      cover={
        <div className="relative">
          <Image
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
            preview={false}
          />
          <div className="absolute top-2 left-2">
            <Tag color="red" className="font-bold">
              -{discountPercentage}%
            </Tag>
          </div>

          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <WishlistButton
              productId={product.id}
              showText={false}
              className="!p-1.5"
            />
          </div>
          
          <div className="absolute bottom-2 right-2">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-white"
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate(`/products/${product.id}`, { state: { fromMenu: 'flash-sale' } }); 
              }}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        <Title level={5} className="line-clamp-2 text-sm">
          {product.name}
        </Title>

        <div className="flex items-center gap-1">
          <StarOutlined className="text-yellow-500 text-sm" />
          <Text className="text-sm text-gray-600">{product.rating?.toFixed(1) || '4.8'}</Text>
          <Text className="text-sm text-gray-400">({product.reviewCount || 0})</Text>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Text className="text-lg font-bold text-red-500">
              {product.promotionalPrice?.toLocaleString('vi-VN') || product.price.toLocaleString('vi-VN')}đ
            </Text>
            {product.promotionalPrice && (
              <Text delete className="text-sm text-gray-400">
                {product.price.toLocaleString('vi-VN')}đ
              </Text>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <Text className="text-gray-600">Đã bán {product.soldCount || 0}</Text>
              <Text className="text-gray-600">Còn {product.stock || 0} sản phẩm</Text>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          danger
          icon={<ShoppingCartOutlined />}
          onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
          className="w-full"
        >
          Mua ngay
        </Button>
      </div>
    </Card>
  );
};

const FlashSalePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { products: flashSaleProducts, loading, error } = useFlashSale();
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname, location.search);

  // Mock countdown time (next 2 hours)
  const countdownTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const handleAddToCart = async (product: Product) => {
    try {
      // Tạo product với giá khuyến mãi để add to cart
      const productWithPromoPrice = {
        ...product,
        price: product.promotionalPrice || product.price
      };
      
      await addToCart(productWithPromoPrice, 1);
      notification.success({
        message: 'Thành công',
        description: 'Đã thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Thêm sản phẩm vào giỏ hàng thất bại',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Text className="text-red-500 text-lg">Có lỗi xảy ra khi tải dữ liệu</Text>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-white text-2xl font-bold">
              FLASH SALE
            </h2>
            <div className="hidden md:flex items-center gap-2 text-white text-sm">
              <ClockCircleOutlined />
              <span>Kết thúc trong</span>
              <CountdownTimer targetTime={countdownTime} />
            </div>
          </div>
          
          {/* Mobile countdown */}
          <div className="md:hidden mt-4">
            <CountdownTimer targetTime={countdownTime} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
         {/* Breadcrumb */}
         <Breadcrumb className="mb-4 text-sm text-gray-600">
          {breadcrumb.map((item, idx) => (
            <Breadcrumb.Item key={idx}>
              <Link to={item.path}>{item.label}</Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        {/* Stats Bar */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Text className="text-2xl font-bold text-red-500">
                  {flashSaleProducts.length}
                </Text>
                <Text className="block text-gray-600">Sản phẩm</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Text className="text-2xl font-bold text-orange-500">
                  {flashSaleProducts.length > 0 
                    ? (Math.round(flashSaleProducts.reduce((acc, p) => acc + (p.rating || 0), 0) / flashSaleProducts.length * 10) / 10).toFixed(1)
                    : '0.0'
                  }
                </Text>
                <Text className="block text-gray-600">Đánh giá TB</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Text className="text-2xl font-bold text-green-500">
                  {flashSaleProducts.reduce((acc, p) => acc + (p.soldCount || 0), 0).toLocaleString()}
                </Text>
                <Text className="block text-gray-600">Đã bán</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Products Grid */}
        <div className="mb-8">
          {flashSaleProducts.length === 0 ? (
            <Card className="text-center py-12">
              <Space direction="vertical" size="large">
                <FireOutlined className="text-6xl text-gray-300" />
                <Title level={4} className="text-gray-500">
                  Hiện tại chưa có sản phẩm Flash Sale
                </Title>
                <Text className="text-gray-400">
                  Hãy quay lại sau để xem các sản phẩm giảm giá hấp dẫn
                </Text>
                <Button type="primary" onClick={() => navigate('/products')}>
                  Xem tất cả sản phẩm
                </Button>
              </Space>
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {flashSaleProducts.map((product) => (
                <Col xs={12} sm={8} md={6} lg={4} key={product.id}>
                  <FlashSaleProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Bottom CTA */}
        <Card className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <Space direction="vertical" size="large">
            <Title level={3} className="text-gray-800">
              Không tìm thấy sản phẩm mong muốn?
            </Title>
            <Text className="text-gray-600 text-lg">
              Khám phá thêm hàng ngàn sản phẩm khác với giá tốt nhất
            </Text>
            <Space>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/products')}
              >
                Xem tất cả sản phẩm
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/categories')}
              >
                Danh mục sản phẩm
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default FlashSalePage;
