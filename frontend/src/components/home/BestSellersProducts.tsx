import React, { useState } from 'react';
import { Product } from '../../types';
import ProductCard from '../product/ProductCard';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface BestSellersProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  breadcrumb: { path: string; label: string };
}

const PAGE_SIZE = 5;

const BestSellersProducts: React.FC<BestSellersProductsProps> = ({ products, onAddToCart, breadcrumb }) => {
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(products.length / PAGE_SIZE) - 1;
  const handleNext = () => {
    if (page < maxPage) setPage(page + 1);
  };
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };
  const pagedProducts = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
        <a href="/best-sellers" className="text-blue-500">Xem tất cả</a>
      </div>
      {/* Nút chuyển trang trái */}
      {page > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
          style={{transform: 'translateY(-50%)'}}
        >
          <LeftOutlined style={{ fontSize: 22 }} />
        </button>
      )}
      {/* Nút chuyển trang phải */}
      {page < maxPage && (
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
          style={{transform: 'translateY(-50%)'}}
        >
          <RightOutlined style={{fontSize: 22}} />
        </button>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {pagedProducts.map((product) => (
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

export default BestSellersProducts; 