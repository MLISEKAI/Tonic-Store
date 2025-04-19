const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || errorData.details || 'Something went wrong';
    throw new Error(errorMessage);
  }
  return response.json();
};

// Auth API
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

// User API
export const getUserProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(response);
};

// Products API
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

export const getProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

// Cart API
export const getCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const addToCart = async (token: string, productId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const updateCartItem = async (token: string, itemId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/update/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
};

export const removeFromCart = async (token: string, itemId: number) => {
  const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

// Orders API
export const createOrder = async (token: string, orderData: {
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  shippingAddress: string;
  shippingPhone: string;
  shippingName: string;
  note?: string;
  paymentMethod: string;
  userId: number;
}) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });
  return handleResponse(response);
};

export const getOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/user`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const getOrder = async (token: string, orderId: number) => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const updateUserProfile = async (token: string, data: {
  name?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  return response.json();
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch categories');
  }
  return response.json();
};

export const getCategoryById = async (id: number) => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch category');
  }
  return response.json();
};
