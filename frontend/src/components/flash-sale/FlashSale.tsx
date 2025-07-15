import React from 'react';
import { notification, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useFlashSale } from '../../hooks/useFlashSale';
import ProductCard from '../product/ProductCard';

interface FlashSaleProps {
  breadcrumb: { path: string; label: string };
}

const FlashSale: React.FC<FlashSaleProps> = ({ breadcrumb }) => {
  const { products, loading, error } = useFlashSale();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
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
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        placement: 'topRight',
      });
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Flash Sale</h2>
        <Link
          to="/flash-sale"
          className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
        >
          Xem tất cả <RightOutlined className="text-xs ml-1"/>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
            breadcrumb={breadcrumb}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashSale; 