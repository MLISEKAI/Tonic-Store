import { Button, notification, Carousel, Spin } from 'antd';
import { ArrowRightOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const CACHE_KEY = 'products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }

      // If no cache or cache expired, fetch from API
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      // Calculate product count for each category
      const categoriesWithCount = categoriesData.map((category: Category) => ({
        ...category,
        productCount: productsData.filter((product: Product) => 
          product.category?.name === category.name
        ).length
      }));

      setProducts(productsData);
      setCategories(categoriesWithCount);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: productsData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Throttle the request by adding a delay
    const timer = setTimeout(() => {
      fetchData();
    }, 1000); // Wait 1 second before making the request

    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleAddToCart = async (product: Product) => {
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
      await addToCart(product, 1);
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
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <Button type="primary" onClick={fetchData}>
          Thử lại
        </Button>
      </div>
    );
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

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Chào mừng đến với Tonic Store</h1>
          <p className="text-xl mb-8">Khám phá những sản phẩm tuyệt vời với giá cả phải chăng</p>
          <Button 
            type="primary" 
            size="large" 
            className="bg-white text-blue-600"
            onClick={() => navigate('/products')}
          >
            Mua sắm ngay <ArrowRightOutlined />
          </Button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm nổi bật</h2>
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

      {/* New Arrivals Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm mới</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Most Viewed Products Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm được xem nhiều nhất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostViewed.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm bán chạy</h2>
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

      {/* Special Offers Banner */}
      <div className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Khuyến mãi đặc biệt</h2>
            <p className="text-xl mb-6">Giảm giá lên đến 50% cho các sản phẩm được chọn</p>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/products')}
            >
              Xem ngay <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 