import { Button, Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 149.99,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
      category: 'Electronics',
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 129.99,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&q=80',
      category: 'Electronics',
    },
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
        <h1 className="text-3xl font-bold mb-4 md:mb-0">All Products</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-full md:w-48"
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Top Rated' },
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
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
