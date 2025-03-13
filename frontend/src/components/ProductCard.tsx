import { FC } from 'react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { token, isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    try {
      await api.addToCart(token!, product.id, 1);
      onAddToCart?.();
    } catch (error) {
      alert('Không thể thêm vào giỏ hàng');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-indigo-600">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Còn lại: {product.stock} sản phẩm
        </p>
      </div>
    </div>
  );
};
