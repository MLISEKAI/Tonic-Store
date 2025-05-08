const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export interface Order {
    id: string;
    userId: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
    };
    items: {
        id: string;
        productId: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            image: string;
        };
    }[];
    payment?: {
        method: string;
        status: string;
        transactionId?: string;
        paymentDate?: string;
    };
}

export interface OrderResponse {
    orders: Order[];
    totalPages: number;
}

const OrderService = {
    // Create new order
    async createOrder(orderData: any) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Get order by ID
    async getOrder(id: string) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Get user's orders
    async getUserOrders(userId: string) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Get all orders (admin)
    async getAllOrders(params: any) {
        try {
            const token = getAuthToken();
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_URL}/orders?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Update order status (admin)
    async updateOrderStatus(id: string, status: string) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Update payment status (admin)
    async updatePaymentStatus(id: string, status: string, transactionId?: string) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders/${id}/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, transactionId }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

export default OrderService;
