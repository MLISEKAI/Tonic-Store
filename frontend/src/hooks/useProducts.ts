import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories } from '../services/api';
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
  const [products, setProducts] = useState<Product[]>([]);
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
        getProducts(category),
        getCategories()
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

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchData
  };
} 