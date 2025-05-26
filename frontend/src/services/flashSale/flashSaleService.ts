import { FlashSale } from '../../types';
import { ENDPOINTS, handleResponse } from '../api';

export const FlashSaleService = {
  async getFlashSales(): Promise<FlashSale[]> {
    const response = await fetch(ENDPOINTS.PRODUCT.FLASH_SALE);
    return handleResponse(response);
  }
}; 