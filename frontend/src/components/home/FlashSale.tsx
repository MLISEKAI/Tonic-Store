import { Card, Button, Statistic, Tag } from 'antd';
import { ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductStatus } from '../../types';
import ProductCard from '../product/ProductCard';

// Dữ liệu tĩnh cho Flash Sale
const flashSaleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 14 Pro Max",
    description: "iPhone 14 Pro Max 256GB",
    price: 24990000,
    originalPrice: 29990000,
    stock: 10,
    imageUrl: "https://images.fpt.shop/unsafe/fit-in/800x800/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/9/7/638001199199600000_iphone-14-pro-max-den-thumb-1.jpg",
    categoryId: 1,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 120,
    viewCount: 1000,
    soldCount: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra",
    description: "Samsung Galaxy S23 Ultra 256GB",
    price: 21990000,
    originalPrice: 26990000,
    stock: 15,
    imageUrl: "https://images.fpt.shop/unsafe/fit-in/800x800/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/2/1/638113333333300000_samsung-galaxy-s23-ultra-thumb-xanh-la-1.jpg",
    categoryId: 1,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 95,
    viewCount: 800,
    soldCount: 400,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "MacBook Pro M2",
    description: "MacBook Pro 14 inch M2 Pro",
    price: 39990000,
    originalPrice: 44990000,
    stock: 8,
    imageUrl: "https://images.fpt.shop/unsafe/fit-in/800x800/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/1/17/638097333333300000_macbook-pro-14-m2-pro-2023-16gb-512gb-thumb-1.jpg",
    categoryId: 2,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 150,
    viewCount: 1200,
    soldCount: 600,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "iPad Pro M2",
    description: "iPad Pro 12.9 inch M2",
    price: 27990000,
    originalPrice: 32990000,
    stock: 12,
    imageUrl: "https://images.fpt.shop/unsafe/fit-in/800x800/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2022/10/18/638013333333300000_ipad-pro-12-9-inch-m2-2022-wifi-128gb-thumb-1.jpg",
    categoryId: 2,
    status: ProductStatus.ACTIVE,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 110,
    viewCount: 900,
    soldCount: 450,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FireOutlined className="text-3xl text-red-500 mr-2" />
            <h2 className="text-3xl font-bold">Flash Sale</h2>
          </div>
          <div className="flex items-center space-x-4">
            <ClockCircleOutlined className="text-xl" />
            <Statistic.Countdown
              value={Date.now() + timeLeft.hours * 3600000 + timeLeft.minutes * 60000 + timeLeft.seconds * 1000}
              format="HH:mm:ss"
              className="text-xl font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onAddToCart={() => {}}
              />
              <div className="absolute top-2 right-2">
                <Tag color="red" className="text-lg font-bold">
                  -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                </Tag>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            danger
            onClick={() => navigate('/products?flash-sale=true')}
          >
            Chớp cơ hội ngay!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSale; 