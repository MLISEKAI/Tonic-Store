export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

// API endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  },
  // User
  USER: {
    PROFILE: `${API_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_URL}/users/change-password`,
    VERIFY_EMAIL: `${API_URL}/users/verify-email`,
    SEND_VERIFICATION: `${API_URL}/users/send-verification`,
  },
  // Products
  PRODUCT: {
    LIST: `${API_URL}/products`,
    DETAIL: (id: number) => `${API_URL}/products/${id}`,
    CATEGORIES: `${API_URL}/categories`,
    SEARCH: `${API_URL}/products/search`,
    VIEW: (id: number) => `${API_URL}/products/${id}/view`,
    FEATURED: (limit: number) => `${API_URL}/products/featured?limit=${limit}`,
    BEST_SELLING: (limit: number) => `${API_URL}/products/best-selling?limit=${limit}`,
    NEWEST: (limit: number) => `${API_URL}/products/newest?limit=${limit}`,
    FLASH_SALE: `${API_URL}/products/flash-sale`
  },
  // Orders
  ORDER: {
    LIST: `${API_URL}/orders`,
    CREATE: `${API_URL}/orders`,
    DETAIL: (id: number) => `${API_URL}/orders/${id}`,
  },
  // Cart
  CART: {
    GET: `${API_URL}/cart`,
    ADD: `${API_URL}/cart/add`,
    UPDATE: `${API_URL}/cart/update`,
    REMOVE: `${API_URL}/cart/remove`,
  },
  // Shipping
  SHIPPING: {
    ADDRESSES: `${API_URL}/shipping-addresses`,
    ADD_ADDRESS: `${API_URL}/shipping-addresses`,
    UPDATE_ADDRESS: (id: number) => `${API_URL}/shipping-addresses/${id}`,
    DELETE_ADDRESS: (id: number) => `${API_URL}/shipping-addresses/${id}`,
    SET_DEFAULT: (id: number) => `${API_URL}/shipping-addresses/${id}/default`,
  }
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Something went wrong');
  }
  return response.json();
};

// API functions
export const getProducts = async () => {
  const response = await fetch(ENDPOINTS.PRODUCT.LIST);
  return handleResponse(response);
};

export const getCategories = async () => {
  const response = await fetch(ENDPOINTS.PRODUCT.CATEGORIES);
  return handleResponse(response);
};


export const getShippingAddresses = async (token: string) => {
  const response = await fetch(ENDPOINTS.SHIPPING.ADDRESSES, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};


export const addShippingAddress = async (token: string, data: any) => {
  const response = await fetch(ENDPOINTS.SHIPPING.ADD_ADDRESS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};


export const updateShippingAddress = async (token: string, id: number, data: any) => {
  const response = await fetch(ENDPOINTS.SHIPPING.UPDATE_ADDRESS(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};


export const deleteShippingAddress = async (token: string, id: number) => {
  const response = await fetch(ENDPOINTS.SHIPPING.DELETE_ADDRESS(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};


export const setDefaultShippingAddress = async (token: string, id: number) => {
  const response = await fetch(ENDPOINTS.SHIPPING.SET_DEFAULT(id), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

