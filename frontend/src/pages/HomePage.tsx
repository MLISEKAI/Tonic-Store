import React, { useState } from 'react';
import { Button, notification, Carousel } from 'antd';
import { ArrowRightOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import BestSellersProducts from '../components/home/BestSellersProducts';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ProductCard from '../components/product/ProductCard';
import FlashSale from '../components/home/FlashSale';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const { products, filteredProducts } = useProducts();
  const { addToCart } = useCart();
  const [visibleSuggestions, setVisibleSuggestions] = useState(8);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
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

  // Get random products if no featured products
  const getRandomProducts = (count: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const featuredProducts = filteredProducts.featured.length > 0 
    ? filteredProducts.featured
    : getRandomProducts(4);

  const bestSellers = filteredProducts.bestSellers.length > 0
    ? filteredProducts.bestSellers
    : getRandomProducts(4);

  // Get random products for today's suggestions
  const todaySuggestions = getRandomProducts(products.length);

  const handleLoadMore = () => {
    setVisibleSuggestions(prev => prev + 8);
  };

  const bannerItems = [
    {
      id: 1,
      image: 'https://img.freepik.com/premium-photo/beautiful-bouquet-pink-white-flowers_136595-11174.jpg',
      title: 'Hoa Xinh Xuống Phố',
      description: 'GIẢM TỚI 25%'
    },
    {
      id: 2,
      image: 'https://img.freepik.com/premium-photo/beautiful-spring-flowers_876883-496.jpg',
      title: 'Bộ Sưu Tập Mới',
      description: 'SALE OFF 30%'
    },
    {
      id: 3,
      image: 'https://img.freepik.com/premium-photo/bouquet-mixed-flowers-white-background_876883-5270.jpg',
      title: 'Flash Sale',
      description: 'Ưu đãi cực sốc'
    }
  ];

  return (
    <div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-2 sm:my-4 lg:my-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-1/5">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8 max-w-[1200px]">
            {/* Top Banner Section */}
            <div className='bg-white p-6 rounded-lg'>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Large Banner */}
                <div className="w-full lg:w-2/3">
                  <div className="carousel-container h-[20vh] sm:h-[30vh] lg:h-[30vh] rounded-lg overflow-hidden relative">
                    <Carousel
                      autoplay
                      dots={true}
                      autoplaySpeed={3000}
                    >
                      {bannerItems.map((item) => (
                        <div key={item.id} className="h-full relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
                            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8">
                              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: '#2ECC71' }}>{item.title}</h2>
                              <div className="mt-2 inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full" style={{ backgroundColor: '#FF69B4' }}>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Carousel>
                  </div>
                </div>

                {/* Right Side Banner */}
                <div className="w-full lg:w-1/3">
                  <div className="h-[20vh] sm:h-[20vh] lg:h-[30vh] bg-white rounded-lg overflow-hidden relative">
                    <img
                      src="https://img.freepik.com/premium-photo/beautiful-bouquet-flowers_136595-4199.jpg"
                      alt="Giảm giá khủng"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
                      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">GIẢM GIÁ</h2>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2" style={{ color: '#FFD700' }}>KHỦNG</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Banners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Banner 1 */}
                <div className="h-[10vh] sm:h-[15vh] bg-white rounded-lg overflow-hidden relative">
                  <img
                    src="https://img.freepik.com/free-photo/pink-roses-bouquet-with-copy-space_23-2148860032.jpg"
                    alt="Banner 1"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">Hoa Tươi Mới</h3>
                    </div>
                  </div>
                </div>

                {/* Banner 2 */}
                <div className="h-[10vh] sm:h-[15vh] bg-white rounded-lg overflow-hidden relative">
                  <img
                    src="https://img.freepik.com/premium-photo/beautiful-bouquet-pink-roses_136595-1591.jpg"
                    alt="Banner 2"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">Gifts that Keep Giving</h3>
                    </div>
                  </div>
                </div>

                {/* Banner 3 */}
                <div className="h-[10vh] sm:h-[15vh] bg-white rounded-lg overflow-hidden relative">
                  <img
                    src="https://img.freepik.com/premium-photo/pink-english-roses-bouquet-white-background_176873-7325.jpg"
                    alt="Banner 3"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="text-lg sm:text-xl font-bold text-white">Hoa Hồng Cao Cấp</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flash Sale Section */}
            <FlashSale />

            {/* Sản phẩm nổi bật */}
            <FeaturedProducts 
              products={featuredProducts}
              onAddToCart={handleAddToCart}
            />

            {/* Sản phẩm bán chạy */}
            <BestSellersProducts 
              products={bestSellers}
              onAddToCart={handleAddToCart}
            />

            {/* Gợi ý hôm nay */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold">Gợi ý hôm nay</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {todaySuggestions.slice(0, visibleSuggestions).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              {visibleSuggestions < todaySuggestions.length && (
                <div className="flex justify-center mt-8">
                  <Button 
                    type="primary"
                    size="large"
                    onClick={handleLoadMore}
                    className="flex items-center"
                  >
                    Xem thêm <ArrowRightOutlined className="ml-2" />
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;  