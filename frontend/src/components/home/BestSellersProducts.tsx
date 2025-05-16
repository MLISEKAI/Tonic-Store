import React from 'react';
import { Product } from '../../types';
import ProductSection from '../product/ProductSection';

interface BestSellersProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const BestSellersProducts: React.FC<BestSellersProductsProps> = ({ products, onAddToCart }) => {
  return (
    <ProductSection
      title="Sản phẩm bán chạy"
      viewAllLink="/best-sellers"
      products={products}
      onAddToCart={onAddToCart}
      type="best-sellers"
    />
  );
};

export default BestSellersProducts; 