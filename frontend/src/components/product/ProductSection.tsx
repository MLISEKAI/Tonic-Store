import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  viewAllLink: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  showViewAll?: boolean;
  // type?: 'default' | 'flash-sale' | 'featured' | 'best-sellers';
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  viewAllLink,
  products,
  onAddToCart,
  showViewAll = true,
  // type = 'default'
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        {showViewAll && (
          <Link
            to={viewAllLink}
            className="text-blue-500 flex items-center hover:text-blue-600 transition-colors"
          >
            Xem tất cả <RightOutlined className="text-xs ml-1"/>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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

export default ProductSection; 