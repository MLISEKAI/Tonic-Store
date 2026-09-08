// In dev, use relative base so Vite proxy handles cookies as same-origin
export const API_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

// Hàm xử lý response từ API
export const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    try {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.details || errorData.message || 'Something went wrong';
        throw new Error(errorMessage);
      }
      const text = await response.text();
      throw new Error(text || 'Something went wrong');
    } catch {
      // Fallback if body is empty or not parsable
      throw new Error('Something went wrong');
    }
  }

  if (response.status === 204) return null;
  try {
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    }
    const text = await response.text();
    if (text && text.trim().startsWith('<')) {
      throw new Error('Received HTML instead of JSON');
    }
    return text ? text : null;
  } catch {
    return null;
  }
};

// Cấu hình fetch để tự động gửi cookies với mọi request
export const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Tự động gửi cookies với mọi request
  });
};

// Hàm getHeaders để sử dụng trong tất cả các API calls
export const getHeaders = (contentType = 'application/json') => {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Auth API
export const login = async (email: string, password: string) => {
  const response = await fetchWithCredentials(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// Shipping Address API
export const getShippingAddresses = async () => {
  try {
    const response = await fetchWithCredentials(`${API_URL}/api/shipping-addresses`, {
      headers: getHeaders()
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
  const response = await fetchWithCredentials(`${API_URL}/api/shipping-addresses`, {
    method: 'POST',
    headers: getHeaders(),
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
  const response = await fetchWithCredentials(`${API_URL}/api/shipping-addresses/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const deleteShippingAddress = async (id: number) => {
  const response = await fetchWithCredentials(`${API_URL}/api/shipping-addresses/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(response);
};

export const setDefaultShippingAddress = async (id: number) => {
  const response = await fetchWithCredentials(`${API_URL}/api/shipping-addresses/${id}/default`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Categories API
export const categoryService = {
  getAll: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: any) => {
    const response = await fetchWithCredentials(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: number, data: any) => {
    const response = await fetchWithCredentials(`${API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetchWithCredentials(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Promotions API
export const promotionService = {
  getAll: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: any) => {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  resetUsage: async (id: string) => {
    const response = await fetchWithCredentials(`${API_URL}/api/discount-codes/${id}/reset`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Shipper API
export const shipperService = {
  getAll: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/shippers`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    // Filter only users with DELIVERY role
    return data.filter((user: any) => user.role === 'DELIVERY');
  },

  updateStatus: async (id: number, isActive: boolean) => {
    const response = await fetchWithCredentials(`${API_URL}/api/users/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetchWithCredentials(`${API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Reviews API
export const reviewService = {
  getAll: async () => {
    const response = await fetchWithCredentials(`${API_URL}/api/reviews`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetchWithCredentials(`${API_URL}/api/reviews/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetchWithCredentials(`${API_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};