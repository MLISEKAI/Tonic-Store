import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import * as api from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await api.getProducts();
        // Lọc và sắp xếp sản phẩm theo rating
        const featuredProducts = allProducts
          .filter((product: { rating: number; }) => product.rating && product.rating >= 4)
          .sort((a: { rating: any; }, b: { rating: any; }) => (b.rating || 0) - (a.rating || 0));
        setProducts(featuredProducts);
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
        <h1 className="text-3xl font-bold text-center mb-12">Sản phẩm nổi bật</h1>
        
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

export default FeaturedProducts;