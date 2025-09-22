export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

// API endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_URL}/api/auth/register`,
    LOGIN: `${API_URL}/api/auth/login`,
    LOGOUT: `${API_URL}/api/auth/logout`,
    FORGOT_PASSWORD: `${API_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/api/auth/reset-password`,
  },
  // User
  USER: {
    PROFILE: `${API_URL}/api/users/profile`,
    CHANGE_PASSWORD: `${API_URL}/api/users/change-password`,
    VERIFY_EMAIL: `${API_URL}/api/users/verify-email`,
    SEND_VERIFICATION: `${API_URL}/api/users/send-verification`,
  },
  // Products
  PRODUCT: {
    LIST: `${API_URL}/api/products`,
    DETAIL: (id: number) => `${API_URL}/api/products/${id}`,
    CATEGORIES: `${API_URL}/api/categories`,
    SEARCH: `${API_URL}/api/products/search`,
    VIEW: (id: number) => `${API_URL}/api/products/${id}/view`,
    FEATURED: (limit: number) => `${API_URL}/api/products/featured?limit=${limit}`,
    BEST_SELLING: (limit: number) => `${API_URL}/api/products/best-selling?limit=${limit}`,
    NEWEST: (limit: number) => `${API_URL}/api/products/newest?limit=${limit}`,
    FLASH_SALE: `${API_URL}/api/products/flash-sale`
  },
  // Orders
  ORDER: {
    LIST: `${API_URL}/api/orders`,
    CREATE: `${API_URL}/api/orders`,
    DETAIL: (id: number) => `${API_URL}/api/orders/${id}`,
    DELIVERY_LIST: `${API_URL}/api/orders/delivery`,
    DELIVERY_STATUS: (id: number) => `${API_URL}/api/orders/${id}/delivery/status`,
    DELIVERY_HISTORY: `${API_URL}/api/orders/delivery/history`,
    DELIVERY_LOGS: (id: number) => `${API_URL}/api/orders/${id}/delivery/logs`,
    DELIVERY_RATING: (id: number) => `${API_URL}/api/orders/${id}/delivery/rating`,
  },
  // Cart
  CART: {
    GET: `${API_URL}/api/cart`,
    ADD: `${API_URL}/api/cart/add`,
    UPDATE: (id: number) => `${API_URL}/api/cart/update/${id}`,
    REMOVE: (id: number) => `${API_URL}/api/cart/remove/${id}`,
    CLEAR: `${API_URL}/api/cart/clear`,
  },
  // Shipping
  SHIPPING: {
    ADDRESSES: `${API_URL}/api/shipping-addresses`,
    ADD_ADDRESS: `${API_URL}/api/shipping-addresses`,
    UPDATE_ADDRESS: (id: number) => `${API_URL}/api/shipping-addresses/${id}`,
    DELETE_ADDRESS: (id: number) => `${API_URL}/api/shipping-addresses/${id}`,
    SET_DEFAULT: (id: number) => `${API_URL}/api/shipping-addresses/${id}/default`,
  },
  // Wishlist
  WISHLIST: {
    LIST: `${API_URL}/api/wishlist`,
    ADD: `${API_URL}/api/wishlist`,
    REMOVE: (id: number) => `${API_URL}/api/wishlist/${id}`,
    CHECK: (id: number) => `${API_URL}/api/wishlist/check/${id}`,
  },
  // Stats
  STATS: {
    OVERVIEW: `${API_URL}/api/stats`,
    SALES: `${API_URL}/api/stats/sales`,
    TOP_CUSTOMERS: (limit: number) => `${API_URL}/api/stats/top-customers?limit=${limit}`,
  },
  // Search
  SEARCH: {
    PRODUCTS: `${API_URL}/api/search/products`,
    ORDERS: `${API_URL}/api/search/orders`,
    SUGGESTIONS: `${API_URL}/api/search/suggestions`,
    HISTORY: `${API_URL}/api/search/history`,
  },
  // Reviews
  REVIEW: {
    LIST: (productId: number) => `${API_URL}/api/reviews/product/${productId}`,
    CREATE: `${API_URL}/api/reviews`,
    UPDATE: (id: number) => `${API_URL}/api/reviews/${id}`,
    DELETE: (id: number) => `${API_URL}/api/reviews/${id}`,
  },
  // Favorites
  FAVORITE: {
    LIST: `${API_URL}/api/favorites`,
    ADD: `${API_URL}/api/favorites`,
    REMOVE: (id: string) => `${API_URL}/api/favorites/${id}`,
  },
  // Categories
  CATEGORY: {
    LIST: `${API_URL}/api/categories`,
    DETAIL: (id: string) => `${API_URL}/api/categories/${id}`,
    PRODUCTS: (id: string) => `${API_URL}/api/categories/${id}/products`,
  },
  // Payment
  PAYMENT: {
    CREATE: `${API_URL}/api/payment`,
    VERIFY: `${API_URL}/api/payment/verify`,
    UPDATE_STATUS: (orderId: string) => `${API_URL}/api/orders/${orderId}/payment`,
    CONFIRM_COD: (orderId: number) => `${API_URL}/api/orders/${orderId}/confirm-cod`,
  },
  // Delivery
  DELIVERY: {
    INFO: (orderId: string) => `${API_URL}/api/orders/${orderId}/delivery`,
    UPDATE_STATUS: (orderId: string) => `${API_URL}/api/orders/${orderId}/delivery/status`,
    HISTORY: (orderId: string) => `${API_URL}/api/orders/${orderId}/delivery/history`,
  },
  // Notifications
  NOTIFICATION: {
    LIST: `${API_URL}/api/notifications`,
    MARK_READ: (id: string) => `${API_URL}/api/notifications/${id}/read`,
    MARK_ALL_READ: `${API_URL}/api/notifications/read-all`,
    DELETE: (id: string) => `${API_URL}/api/notifications/${id}`,
    DELETE_ALL: `${API_URL}/api/notifications`,
  },
  // Contact
  CONTACT: {
    SEND: `${API_URL}/api/contact`,
    LIST: `${API_URL}/api/contact/messages`,
    MARK_READ: (id: string) => `${API_URL}/api/contact/${id}/read`,
    DELETE: (id: string) => `${API_URL}/api/contact/${id}`,
  },
  // Shipper
  SHIPPER: {
    UPDATE_STATUS: (orderId: number) => `${API_URL}/api/shippers/orders/${orderId}/status`,
  },
  // Help Center
  HELP_CENTER: {
    SEARCH: `${API_URL}/api/help-center/search`,
    SUGGESTIONS: `${API_URL}/api/help-center/suggestions`,
  },
};

// Helper function to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
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

export async function forgotPassword(email: string) {
  const res = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Có lỗi xảy ra!');
  }
  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Có lỗi xảy ra!');
  }
  return res.json();
}

