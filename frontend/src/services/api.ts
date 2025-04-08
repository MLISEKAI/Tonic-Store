const API_URL = 'http://localhost:8085/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
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

// Products API
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
};

export const getProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

// Cart API
export const getCart = async (token: string) => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const addToCart = async (token: string, productId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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
export const createOrder = async (token: string) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const getOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders`, {
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
