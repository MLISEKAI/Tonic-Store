import { useState, useEffect, useCallback } from 'react';
import useDebounce from './useDebounce';
import { ProductService } from '../services/product/productService';
import { Product } from '../types';

/**
 * Custom hook to manage product search functionality
 * @param initialQuery - Initial search query (optional)
 * @returns Object containing search state and functions
 */
export function useSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query to avoid too many API calls
  const debouncedQuery = useDebounce(query, 500);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.searchProducts(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Could not perform search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch
  };
} 