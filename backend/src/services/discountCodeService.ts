import { DiscountCodeRepository } from '../repositories';

const discountCodeRepository = new DiscountCodeRepository();

export const discountCodeService = {
  getAll: async () => {
    return discountCodeRepository.findAll();
  },
  getById: async (id: number) => {
    return discountCodeRepository.findById(id);
  },
  getByCode: async (code: string) => {
    return discountCodeRepository.findByCode(code);
  },
  create: async (data: any) => {
    // Validate logic có thể giữ lại ở đây nếu cần
    return discountCodeRepository.create(data);
  },
  update: async (id: number, data: any) => {
    return discountCodeRepository.update(id, data);
  },
  delete: async (id: number) => {
    return discountCodeRepository.delete(id);
  },
  claimDiscountCode: async (code: string, userId: number) => {
    return discountCodeRepository.claimDiscountCode(code, userId);
  },
  saveDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    return discountCodeRepository.saveDiscountCodeUsage(userId, discountCodeId, orderId);
  },
  checkUserUsage: async (userId: number, discountCodeId: number) => {
    return discountCodeRepository.checkUserUsage(userId, discountCodeId);
  },
  updateDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    return discountCodeRepository.updateDiscountCodeUsage(userId, discountCodeId, orderId);
  },
  resetUsage: async (id: number) => {
    return discountCodeRepository.resetUsage(id);
  },
}; 