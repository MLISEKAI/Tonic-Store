import React from 'react';
import { Input, Select, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductListPageProps {
  title: string;
  products: Product[];
  loading: boolean;
  error?: string;
  onAddToCart: (product: Product) => void;
  onSearch: (value: string) => void;
  onSort: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  searchText: string;
  sortBy: string;
}

const ProductListPage: React.FC<ProductListPageProps> = ({
  title,
  products,
  loading,
  error,
  onAddToCart,
  onSearch,
  onSort,
  sortOptions,
  searchText,
  sortBy
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{title}</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            onChange={(e) => onSearch(e.target.value)}
            value={searchText}
          />
          <Select
            value={sortBy}
            onChange={onSort}
            className="w-full md:w-48"
            options={sortOptions}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Không tìm thấy sản phẩm nào
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage; 