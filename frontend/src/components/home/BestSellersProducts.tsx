import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { Product } from '../../types';
import ProductCard from '../product/ProductCard';

interface BestSellersProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const BestSellersProducts: React.FC<BestSellersProductsProps> = ({ products, onAddToCart }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Sản phẩm bán chạy</h2>
        <Link
          to="/best-sellers"
          className="text-blue-500 flex items-center"
        >
          Xem tất cả <RightOutlined className="text-xs ml-1"/>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellersProducts; 