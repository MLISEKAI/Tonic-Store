import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductService } from '../services/product/productService';

/**
 * Custom hook to manage flash sale products
 * @returns Object containing flash sale products, loading state and refetch function
 */
export function useFlashSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashSaleProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getFlashSaleProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      setError('Could not load flash sale products');
      throw new Error('Could not load flash sale products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchFlashSaleProducts
  };
} 