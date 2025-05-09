import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductService } from '../services/product/productService';
import { CategoryService } from '../services/category/categoryService';
import { Product } from '../types';

interface Category {
  id: number;
  name: string;
  imageUrl?: string;
  productCount?: number;
}

const CACHE_KEY = 'products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProducts(category?: string) {
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }

      // If no cache or cache expired, fetch from API
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getProducts(category),
        CategoryService.getCategories()
      ]);

      // Calculate product count for each category
      const categoriesWithCount = categoriesData.map((category: Category) => ({
        ...category,
        productCount: productsData.filter((product: Product) => 
          product.category?.name === category.name
        ).length
      }));

      setProducts(productsData);
      setCategories(categoriesWithCount);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: productsData,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    return {
      featured: products.filter(p => p.isFeatured).slice(0, 4),
      new: products.filter(p => p.isNew).slice(0, 4),
      bestSellers: products.filter(p => p.isBestSeller).slice(0, 4),
      mostViewed: [...products]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 4)
    };
  }, [products]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchData,
    filteredProducts
  };
} 