const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  soldCount?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
  origin?: string;
  warranty?: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
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
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  getProductById: async (id: number): Promise<Product> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Failed to delete product');
    }
  }
};
