import { Button, Input, notification } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../services/api';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        // Lấy 6 sản phẩm đầu tiên
        setProducts(productsData.slice(0, 6));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div 
                  className="h-48 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img
                    alt={product.name}
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="ml-2 text-gray-500">({product.rating || 0})</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">${product.price}</p>
                </div>
                <div className="flex border-t">
                  <button 
                    className="flex-1 p-3 text-gray-600 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Xử lý yêu thích
                    }}
                  >
                    <HeartOutlined className="text-lg" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="flex-1 p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
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
          <div className="overflow-x-auto">
            <div className="flex space-x-6 pb-4">
              {categories.map((category) => (
                <Link 
                  to={`/products?category=${encodeURIComponent(category.name)}`} 
                  key={category.id} 
                  className="flex-none w-64 h-64"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="h-40 overflow-hidden rounded-t-lg">
                      <img
                        alt={category.name}
                        src={category.imageUrl || 'https://via.placeholder.com/400'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-center items-center text-center">
                      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-500 text-sm">{category.productCount || 0} sản phẩm</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 