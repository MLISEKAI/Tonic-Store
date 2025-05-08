import { Button, notification, Carousel, Spin } from 'antd';
import { ArrowRightOutlined, RightOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import TopBar from '../components/home/TopBar';
import FlashSale from '../components/home/FlashSale';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import LiveChat from '../components/home/LiveChat';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const CACHE_KEY = 'products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const HomePage = () => {
  const navigate = useNavigate();
  const { products, categories, loading, error } = useProducts();
  const { addToCart } = useCart();

  // Wrapper function to add to cart with default quantity of 1
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (error) {
    notification.error({
      message: 'Lỗi',
      description: 'Thêm sản phẩm vào giỏ hàng thất bại',
      placement: 'topRight',
      duration: 2,
    });
  }

  // Get random products if no featured products
  const getRandomProducts = (count: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const featuredProducts = products.filter(p => p.isFeatured).length > 0 
    ? products.filter(p => p.isFeatured).slice(0, 4)
    : getRandomProducts(4);

  const newProducts = products.filter(p => p.isNew).length > 0
    ? products.filter(p => p.isNew).slice(0, 4)
    : getRandomProducts(4);

  const bestSellers = products.filter(p => p.isBestSeller).length > 0
    ? products.filter(p => p.isBestSeller).slice(0, 4)
    : getRandomProducts(4);

  const mostViewed = [...products]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 4);

  const bannerItems = [
    {
      id: 1,
      image: 'https://via.placeholder.com/1920x600/2563eb/ffffff?text=Khuyến+Mãi+Hè',
      title: 'Khuyến Mãi Hè',
      description: 'Giảm giá lên đến 50% cho các sản phẩm được chọn'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/1920x600/059669/ffffff?text=Sản+Phẩm+Mới',
      title: 'Sản Phẩm Mới',
      description: 'Khám phá ngay những sản phẩm mới nhất'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/1920x600/dc2626/ffffff?text=Flash+Sale',
      title: 'Flash Sale',
      description: 'Chớp cơ hội mua sắm với giá sốc'
    }
  ];

  return (
    <div>
      <TopBar />
      <LiveChat />

      {/* Banner Carousel */}
      <Carousel autoplay className="mb-8">
        {bannerItems.map((item) => (
          <div key={item.id}>
            <div
              className="relative h-[400px] md:h-[600px] bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                <div className="container mx-auto px-4 text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h2>
                  <p className="text-xl md:text-2xl mb-8">{item.description}</p>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/products')}
                  >
                    Mua sắm ngay <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Sản phẩm nổi bật */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
            <Link
              to="/featured-products"
              className="text-blue-500 flex items-center"
            >
              Xem tất cả <RightOutlined className="text-xs ml-1"/>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sản phẩm bán chạy */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Sản phẩm bán chạy</h2>
              <Link
                to="/best-selling"
                className="text-blue-500 flex items-center"
              >
                Xem tất cả <RightOutlined className="text-xs ml-1"/>
              </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tại sao chúng tôi chọn*/}
      <WhyChooseUs />

      {/* Khách hàng đánh giá*/}
      <CustomerReviews />
    </div>
  );
};

export default HomePage; 