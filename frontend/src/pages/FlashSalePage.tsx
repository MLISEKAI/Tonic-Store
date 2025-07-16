import React, { useState } from 'react';
import { notification } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import ProductListPage from '../components/product/ProductListPage';
import { useFlashSale } from '../hooks/useFlashSale';
import { getBreadcrumbFromPath } from '../utils/breadcrumb';

const FlashSalePage = () => {
  const { products, loading, error } = useFlashSale();
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = getBreadcrumbFromPath(location.pathname, location.search);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
        duration: 2,
      });
      navigate('/');
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

  const filteredProducts = products.filter(product => {
    const productName = product.name.toLowerCase();
    const searchTerm = searchText.toLowerCase();
    return productName.includes(searchTerm);
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

  const sortOptions = [
    { value: 'featured', label: 'Nổi bật' },
    { value: 'price-low', label: 'Giá: Thấp đến cao' },
    { value: 'price-high', label: 'Giá: Cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao' },
  ];
  return (
    <ProductListPage
    title="Flash Sale"
    products={sortedProducts}
    loading={loading}
    error={error ?? undefined}
    onAddToCart={handleAddToCart}
    onSearch={handleSearch}
    onSort={setSortBy}
    sortOptions={sortOptions}
    searchText={searchText}
    sortBy={sortBy}
    />
  );
};

export default FlashSalePage;
