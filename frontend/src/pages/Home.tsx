import { Button, Input } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import { Product } from '../types';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Chào mừng đến với Tonic Store</h1>
          <p className="text-xl mb-8">Khám phá những sản phẩm tuyệt vời với giá cả phải chăng</p>
          <Button type="primary" size="large" className="bg-white text-blue-600">
            Mua sắm ngay <ArrowRightOutlined />
          </Button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-3xl font-bold">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    alt={product.name}
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="ml-2 text-gray-500">({product.rating || 0})</span>
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
      </div>

      {/* Categories Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-3xl font-bold">Mua sắm theo danh mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} key={category.id} className="block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={category.name}
                      src={category.imageUrl || 'https://via.placeholder.com/400'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-500 text-sm">{category.productCount || 0} sản phẩm</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 