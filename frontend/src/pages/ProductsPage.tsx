import { Button, Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    {
      id: 1,
      name: 'Tai nghe cao cấp Sony WH-1000XM4',
      price: 349.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      category: 'Điện tử',
    },
    {
      id: 2,
      name: 'Tai nghe không dây AirPods Pro',
      price: 249.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 3,
      name: 'Đồng hồ thông minh Apple Watch Series 7',
      price: 399.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 4,
      name: 'Loa Bluetooth JBL Charge 5',
      price: 179.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 5,
      name: 'Máy ảnh Canon EOS R5',
      price: 3899.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 6,
      name: 'Máy tính xách tay MacBook Pro M1',
      price: 1299.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 7,
      name: 'Điện thoại iPhone 13 Pro',
      price: 999.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1633891126867-28a27b5b4d3f?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 8,
      name: 'Máy tính bảng iPad Pro',
      price: 799.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 9,
      name: 'Máy chơi game PS5',
      price: 499.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 10,
      name: 'Màn hình Dell UltraSharp 32"',
      price: 899.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
      category: 'Điện tử',
    },
    {
      id: 11,
      name: 'Bàn phím cơ Razer BlackWidow',
      price: 149.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 12,
      name: 'Chuột gaming Logitech G Pro X',
      price: 129.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 13,
      name: 'Ổ cứng SSD Samsung 1TB',
      price: 129.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 14,
      name: 'Thẻ nhớ SanDisk Extreme 256GB',
      price: 49.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 15,
      name: 'Bộ sạc nhanh Anker 65W',
      price: 79.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 16,
      name: 'Balo laptop Targus',
      price: 89.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 17,
      name: 'Giá đỡ laptop Rain Design',
      price: 69.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 18,
      name: 'Webcam Logitech C920',
      price: 99.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 19,
      name: 'Microphone Blue Yeti',
      price: 129.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Phụ kiện',
    },
    {
      id: 20,
      name: 'Bộ loa Creative Pebble',
      price: 39.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Phụ kiện',
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Tất cả sản phẩm</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-full md:w-48"
            options={[
              { value: 'featured', label: 'Nổi bật' },
              { value: 'price-low', label: 'Giá: Thấp đến cao' },
              { value: 'price-high', label: 'Giá: Cao đến thấp' },
              { value: 'rating', label: 'Đánh giá cao' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img
                alt={product.name}
                src={product.image}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-gray-500">({product.rating})</span>
              </div>
              <p className="text-xl font-bold text-blue-600">${product.price}</p>
            </div>
            <div className="flex border-t">
              <button className="flex-1 p-3 text-gray-600 hover:text-red-500 transition-colors">
                <HeartOutlined className="text-lg" />
              </button>
              <button className="flex-1 p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <ShoppingCartOutlined className="mr-2" />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
