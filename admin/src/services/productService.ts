const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  category?: string;
}

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Something went wrong');
  }
  return res.json();
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const res = await fetch(API_URL);
    return handleResponse(res);
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}`);
    return handleResponse(res);
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete product');
    }
  }
};
