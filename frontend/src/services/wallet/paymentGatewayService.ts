import { ENDPOINTS, fetchWithCredentials, getHeaders, handleResponse } from '../api';

export interface TopUpPackage {
  id: number;
  name: string;
  description?: string;
  amount: number;
  bonusAmount?: number;
  currency: string;
  isActive: boolean;
  displayOrder: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGatewayTransaction {
  id: number;
  walletId: number;
  userId: number;
  gateway: string;
  status: string;
  amount: number;
  currency: string;
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  description?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const TopUpPackageService = {
  async getAll(): Promise<TopUpPackage[]> {
    const response = await fetchWithCredentials(ENDPOINTS.TOP_UP_PACKAGES.LIST, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getActive(): Promise<TopUpPackage[]> {
    const response = await fetchWithCredentials(ENDPOINTS.TOP_UP_PACKAGES.ACTIVE, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<TopUpPackage> {
    const response = await fetchWithCredentials(ENDPOINTS.TOP_UP_PACKAGES.DETAIL(id), {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const PaymentGatewayService = {
  async createDeposit(amount: number, gateway: string, packageName?: string) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT_GATEWAY.DEPOSIT, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, gateway, packageName }),
    });
    return handleResponse(response);
  },

  async completePayment(transactionId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT_GATEWAY.COMPLETE(transactionId), {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async failPayment(transactionId: number, reason?: string) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT_GATEWAY.FAIL(transactionId), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
  },

  async cancelPayment(transactionId: number) {
    const response = await fetchWithCredentials(ENDPOINTS.PAYMENT_GATEWAY.CANCEL(transactionId), {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
