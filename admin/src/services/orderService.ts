const API_URL = import.meta.env.VITE_API_URL;

export interface Order {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        email: string;
    };
    items: {
        productId: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            image: string;
        };
    }[];
}

export interface OrderResponse {
    orders: Order[];
    totalPages: number;
}

class OrderService {
    private static instance: OrderService;
    private token: string | null;

    private constructor() {
        this.token = localStorage.getItem('token');
    }

    public static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async getAllOrders(page: number = 1, status?: string): Promise<OrderResponse> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            ...(status && { status })
        });

        const response = await fetch(`${API_URL}/user/orders?${queryParams}`, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return response.json();
    }

    async updateOrderStatus(orderId: string, status: string): Promise<void> {
        const response = await fetch(`${API_URL}/user/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
    }

    async updatePaymentStatus(orderId: string, status: string, transactionId?: string): Promise<void> {
        const response = await fetch(`${API_URL}/user/orders/${orderId}/payment`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({ status, transactionId })
        });

        if (!response.ok) {
            throw new Error('Failed to update payment status');
        }
    }
}

export default OrderService.getInstance(); 