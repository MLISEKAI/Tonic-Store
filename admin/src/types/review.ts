export interface Review {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
  };
  userId: string;
  user: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
} 