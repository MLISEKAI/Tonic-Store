import React from 'react';
import { Product } from '../../types';
import ProductSection from '../product/ProductSection';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  showViewAll?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products, 
  onAddToCart,
  showViewAll = true 
}) => {
  return (
    <ProductSection
      title="Sản phẩm nổi bật"
      viewAllLink="/featured-products"
      products={products}
      onAddToCart={onAddToCart}
      showViewAll={showViewAll}
      type="featured"
    />
  );
};

export default FeaturedProducts; 