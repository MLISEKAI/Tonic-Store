const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error || errorData.details || 'Something went wrong';
    throw new Error(errorMessage);
  }
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
};

const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

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
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/shipping-addresses`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error('Error in getShippingAddresses:', error);
    throw error;
  }
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

// Categories API
export const categoryService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  },
};

// Promotions API
export const promotionService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/discount-codes`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch promotions');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/discount-codes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create promotion');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/discount-codes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update promotion');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/discount-codes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete promotion');
    return response.json();
  },
};

// Shipper API
export const shipperService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    // Filter only users with DELIVERY role
    return data.filter((user: any) => user.role === 'DELIVERY');
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Reviews API
export const reviewService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/reviews`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/reviews/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update review status');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  },
}; 