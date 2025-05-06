import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import * as api from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const BestSellingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await api.getProducts();
        // Sắp xếp sản phẩm theo số lượng đã bán
        const bestSellingProducts = allProducts
          .filter((product: { soldCount: number; }) => product.soldCount && product.soldCount > 0)
          .sort((a: { soldCount: any; }, b: { soldCount: any; }) => (b.soldCount || 0) - (a.soldCount || 0));
        setProducts(bestSellingProducts);
      } catch (error) {
        message.error('Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Sản phẩm bán chạy</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellingProducts; 