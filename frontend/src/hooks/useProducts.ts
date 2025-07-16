import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts, getCategories } from "../services/api";
import { Product } from '../types';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const CACHE_KEY = 'product_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initialize from cache if available
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return [];
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      // Calculate product count for each category
      const categoriesWithCount = categoriesData.map((category: Category) => ({
        ...category,
        productCount: productsData.filter((product: Product) => 
          product.category?.name === category.name
        ).length
      }));

      // Update state
      setProducts(productsData);
      setCategories(categoriesWithCount);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: productsData,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return {
      featured: products.filter(p => p.isFeatured),
      new: products.filter(p => p.isNew),
      bestSellers: products.filter(p => p.isBestSeller),
      mostViewed: [...products]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5)
    };
  }, [products]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
    filteredProducts
  };
}; 