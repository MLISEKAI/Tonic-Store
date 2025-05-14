import React, { useState, useEffect } from 'react';
import { Input, Select, notification, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { ProductService } from '../services/product/productService';

const BestSellersPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('best-selling');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getBestSellingProducts();
        setProducts(data);
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm bán chạy',
          placement: 'topRight',
          duration: 2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      case 'best-selling':
      default:
        return (b.soldCount || 0) - (a.soldCount || 0);
    }
  });

  const handleAddToCart = async (product: Product) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Sản phẩm bán chạy</h1>
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
              { value: 'best-selling', label: 'Bán chạy nhất' },
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
          Không tìm thấy sản phẩm bán chạy nào
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellersPage; 