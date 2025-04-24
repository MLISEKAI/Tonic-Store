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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// Shipping Address API
export const getShippingAddresses = async () => {
  const response = await fetch(`${API_URL}/shipping-addresses`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const createShippingAddress = async (data: {
  name: string;
  phone: string;
  address: string;
  userId: number;
  isDefault?: boolean;
}) => {
  const response = await fetch(`${API_URL}/shipping-addresses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateShippingAddress = async (id: number, data: {
  name?: string;
  phone?: string;
  address?: string;
  userId?: number;
  isDefault?: boolean;
}) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const deleteShippingAddress = async (id: number) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const setDefaultShippingAddress = async (id: number) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}/default`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
}; 