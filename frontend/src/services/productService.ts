const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (category?: string) => {
  const url = new URL(`${API_URL}/products`);
  if (category) {
    url.searchParams.append('category', category);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch products');
  }
  return response.json();
};

export const getProductById = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch product');
  }
  return response.json();
};

export const createProduct = async (product: any, token: string) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create product');
  }
  return response.json();
};

export const updateProduct = async (id: number, product: any, token: string) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update product');
  }
  return response.json();
};

export const deleteProduct = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete product');
  }
  return response.json();
}; 