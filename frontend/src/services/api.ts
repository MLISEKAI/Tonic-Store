export const API_URL = import.meta.env.VITE_API_URL;

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
  const url = category 
    ? `${API_URL}/products?category=${encodeURIComponent(category)}`
    : `${API_URL}/products`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const searchProducts = async (query: string) => {
  try {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Cart API
export const getCart = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) throw new Error('Failed to add to cart');
  return response.json();
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error('Failed to update cart item');
  return response.json();
};

export const removeCartItem = async (itemId: number) => {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to remove cart item');
  return response.json();
};

// Orders API
export const createOrder = async (orderData: any) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const getOrders = async (page = 1, status?: string) => {
  const url = status 
    ? `${API_URL}/orders?page=${page}&status=${status}`
    : `${API_URL}/orders?page=${page}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const getOrder = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
};

export const cancelOrder = async (id: number) => {
  const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to cancel order');
  return response.json();
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
  return handleResponse(response);
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
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

export const incrementProductView = async (id: number) => {
  const response = await fetch(`${API_URL}/products/${id}/view`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to increment view');
  return response.json();
};

// Reviews API
export const getProductReviews = async (productId: number, page = 1) => {
  const response = await fetch(`${API_URL}/products/${productId}/reviews?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const createReview = async (productId: number, reviewData: {
  rating: number;
  comment: string;
}) => {
  const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) throw new Error('Failed to create review');
  return response.json();
};

export const deleteReview = async (productId: number, reviewId: number) => {
  const response = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete review');
  return response.json();
};

// Stats API
export const getStats = async (token: string) => {
  const response = await fetch(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const getSalesByDate = async (token: string, startDate: string, endDate: string) => {
  const response = await fetch(`${API_URL}/stats/sales?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const getTopCustomers = async (token: string, limit: number = 10) => {
  const response = await fetch(`${API_URL}/stats/top-customers?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(response);
};

// Payment API
export const createPaymentUrl = async (token: string, orderId: number) => {
  const response = await fetch(`${API_URL}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ orderId })
  });

  if (!response.ok) {
    throw new Error('Failed to create payment URL');
  }

  return response.json();
};

export const verifyPayment = async (token: string, data: {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}) => {
  const response = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Shipping Address API
export const getShippingAddresses = async (token: string) => {
  const response = await fetch(`${API_URL}/shipping-addresses`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const getShippingAddress = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const createShippingAddress = async (token: string, data: {
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}) => {
  const response = await fetch(`${API_URL}/shipping-addresses`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const updateShippingAddress = async (token: string, id: number, data: {
  name?: string;
  phone?: string;
  address?: string;
  isDefault?: boolean;
}) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const deleteShippingAddress = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const setDefaultShippingAddress = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/shipping-addresses/${id}/default`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
};

export const sendContactMessage = async (messageData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const updatePaymentStatus = async (token: string, orderId: string, status: string) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('Failed to update payment status');
  }

  return response.json();
};
