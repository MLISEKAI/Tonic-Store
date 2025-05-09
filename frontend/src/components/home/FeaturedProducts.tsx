import React, { useState, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/product/productService';
import { Product } from '../../types';
import ProductCard from '../product/ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await ProductService.getProducts();
        // Lọc và sắp xếp sản phẩm theo rating
        const featuredProducts = allProducts
          .filter((product: Product) => product.rating && product.rating >= 4)
          .sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4); // Chỉ hiển thị 4 sản phẩm
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
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Sản phẩm nổi bật</h2>
          <Button 
            type="primary"
            onClick={() => navigate('/featured-products')}
          >
            Xem tất cả
          </Button>
        </div>

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