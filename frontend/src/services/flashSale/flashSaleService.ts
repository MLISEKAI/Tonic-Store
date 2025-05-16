import { FlashSale } from '../../types';

export const FlashSaleService = {
  async getFlashSales(): Promise<FlashSale[]> {
    const response = await fetch('/api/flash-sales');
    if (!response.ok) {
      throw new Error('Failed to fetch flash sales');
    }
    return response.json();
  }
}; 