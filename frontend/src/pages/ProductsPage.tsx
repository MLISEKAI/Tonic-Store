import { Button, Input, Select, message, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getProducts } from '../services/productService';
import { Product } from '../types';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(category ? decodeURIComponent(category) : undefined);
        setProducts(data);
      } catch (error) {
        message.error('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name.toLowerCase();
    const categoryName = product.category?.name?.toLowerCase() || '';
    const searchTerm = searchText.toLowerCase();
    
    return productName.includes(searchTerm) || categoryName.includes(searchTerm);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated || !token) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, 1);
      message.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      message.error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          {category ? decodeURIComponent(category) : 'Tất cả sản phẩm'}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 ml-2">({product.rating || 0})</span>
                </div>
                <p className="text-blue-600 font-bold mb-4">
                  {product.price.toLocaleString('vi-VN')}đ
                </p>
                <div className="flex justify-between">
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button icon={<HeartOutlined />} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
