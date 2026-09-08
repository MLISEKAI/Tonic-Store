import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export interface WalletBalance {
  balance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
}

export interface WalletInfo {
  id: number;
  userId: number;
  balance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: number;
  type: string;
  status: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: number;
  description?: string;
  createdAt: string;
}

export const WalletService = {
  async getWallet(): Promise<WalletInfo> {
    const response = await fetchWithCredentials(ENDPOINTS.WALLET.GET, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async topUp(amount: number, description?: string, idempotencyKey?: string) {
    const response = await fetchWithCredentials(ENDPOINTS.WALLET.TOPUP, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, description, idempotencyKey }),
    });
    return handleResponse(response);
  },

  async deduct(amount: number, referenceType?: string, referenceId?: number, description?: string, idempotencyKey?: string) {
    const response = await fetchWithCredentials(ENDPOINTS.WALLET.DEDUCT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, referenceType, referenceId, description, idempotencyKey }),
    });
    return handleResponse(response);
  },

  async refund(amount: number, referenceType: string, referenceId: number, description?: string, idempotencyKey?: string) {
    const response = await fetchWithCredentials(ENDPOINTS.WALLET.REFUND, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, referenceType, referenceId, description, idempotencyKey }),
    });
    return handleResponse(response);
  },

  async getTransactions(page: number = 1, limit: number = 20) {
    const response = await fetchWithCredentials(
      `${ENDPOINTS.WALLET.TRANSACTIONS}?page=${page}&limit=${limit}`,
      { headers: getHeaders() }
    );
    return handleResponse(response);
  },
};
