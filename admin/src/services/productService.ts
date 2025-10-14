import { fetchWithCredentials, getHeaders } from './api';
import { Product, CreateProductData, UpdateProductData } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL + '/api/products';

// Xử lý phản hồi từ API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const res = await fetchWithCredentials(API_URL, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const res = await fetchWithCredentials(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: number): Promise<void> => {
    const res = await fetchWithCredentials(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete product');
    }
  }
};
