import React from 'react';
import { Product } from '../../types';
import ProductCard from '../product/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  showViewAll?: boolean;
  breadcrumb: { path: string; label: string };
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products, 
  onAddToCart,
  showViewAll = true,
  breadcrumb
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
        {showViewAll && (
          <a href="/featured-products" className="text-blue-500">
            Xem tất cả
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            breadcrumb={breadcrumb}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts; 