import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import ProductListPage from '../components/product/ProductListPage';
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

  const sortOptions = [
    { value: 'best-selling', label: 'Bán chạy nhất' },
    { value: 'price-low', label: 'Giá: Thấp đến cao' },
    { value: 'price-high', label: 'Giá: Cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao' },
  ];

  return (
    <ProductListPage
      title="Sản phẩm bán chạy"
      products={sortedProducts}
      loading={loading}
      onAddToCart={handleAddToCart}
      onSearch={handleSearch}
      onSort={setSortBy}
      sortOptions={sortOptions}
      searchText={searchText}
      sortBy={sortBy}
    />
  );
};

export default BestSellersPage; 