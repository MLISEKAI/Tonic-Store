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
    DELIVERY_LIST: `${API_URL}/orders/delivery`,
    DELIVERY_STATUS: (id: number) => `${API_URL}/orders/${id}/delivery/status`,
    DELIVERY_HISTORY: `${API_URL}/orders/delivery/history`,
    DELIVERY_LOGS: (id: number) => `${API_URL}/orders/${id}/delivery/logs`,
    DELIVERY_RATING: (id: number) => `${API_URL}/orders/${id}/delivery/rating`,
  },
  // Cart
  CART: {
    GET: `${API_URL}/cart`,
    ADD: `${API_URL}/cart/add`,
    UPDATE: (id: number) => `${API_URL}/cart/update/${id}`,
    REMOVE: (id: number) => `${API_URL}/cart/remove/${id}`,
    CLEAR: `${API_URL}/cart/clear`,
  },
  // Shipping
  SHIPPING: {
    ADDRESSES: `${API_URL}/shipping-addresses`,
    ADD_ADDRESS: `${API_URL}/shipping-addresses`,
    UPDATE_ADDRESS: (id: number) => `${API_URL}/shipping-addresses/${id}`,
    DELETE_ADDRESS: (id: number) => `${API_URL}/shipping-addresses/${id}`,
    SET_DEFAULT: (id: number) => `${API_URL}/shipping-addresses/${id}/default`,
  },
  // Wishlist
  WISHLIST: {
    LIST: `${API_URL}/wishlist`,
    ADD: `${API_URL}/wishlist`,
    REMOVE: (id: number) => `${API_URL}/wishlist/${id}`,
    CHECK: (id: number) => `${API_URL}/wishlist/check/${id}`,
  },
  // Stats
  STATS: {
    OVERVIEW: `${API_URL}/stats`,
    SALES: `${API_URL}/stats/sales`,
    TOP_CUSTOMERS: (limit: number) => `${API_URL}/stats/top-customers?limit=${limit}`,
  },
  // Search
  SEARCH: {
    PRODUCTS: `${API_URL}/search/products`,
    ORDERS: `${API_URL}/search/orders`,
    SUGGESTIONS: `${API_URL}/search/suggestions`,
    HISTORY: `${API_URL}/search/history`,
  },
  // Reviews
  REVIEW: {
    LIST: (productId: number) => `${API_URL}/reviews/product/${productId}`,
    CREATE: `${API_URL}/reviews`,
    UPDATE: (id: number) => `${API_URL}/reviews/${id}`,
    DELETE: (id: number) => `${API_URL}/reviews/${id}`,
  },
  // Favorites
  FAVORITE: {
    LIST: `${API_URL}/favorites`,
    ADD: `${API_URL}/favorites`,
    REMOVE: (id: string) => `${API_URL}/favorites/${id}`,
  },
  // Categories
  CATEGORY: {
    LIST: `${API_URL}/categories`,
    DETAIL: (id: string) => `${API_URL}/categories/${id}`,
    PRODUCTS: (id: string) => `${API_URL}/categories/${id}/products`,
  },
  // Payment
  PAYMENT: {
    CREATE: `${API_URL}/payment`,
    VERIFY: `${API_URL}/payment/verify`,
    UPDATE_STATUS: (orderId: string) => `${API_URL}/orders/${orderId}/payment`,
    CONFIRM_COD: (orderId: number) => `${API_URL}/orders/${orderId}/confirm-cod`,
  },
  // Delivery
  DELIVERY: {
    INFO: (orderId: string) => `${API_URL}/orders/${orderId}/delivery`,
    UPDATE_STATUS: (orderId: string) => `${API_URL}/orders/${orderId}/delivery/status`,
    HISTORY: (orderId: string) => `${API_URL}/orders/${orderId}/delivery/history`,
  },
  // Notifications
  NOTIFICATION: {
    LIST: `${API_URL}/notifications`,
    MARK_READ: (id: string) => `${API_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_URL}/notifications/read-all`,
    DELETE: (id: string) => `${API_URL}/notifications/${id}`,
    DELETE_ALL: `${API_URL}/notifications`,
  },
  // Contact
  CONTACT: {
    SEND: `${API_URL}/contact`,
    LIST: `${API_URL}/contact/messages`,
    MARK_READ: (id: string) => `${API_URL}/contact/${id}/read`,
    DELETE: (id: string) => `${API_URL}/contact/${id}`,
  },
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
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

