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
  validateAndApply: async (code: string, userId: number) => {
    const discountCode = await discountCodeRepository.findByCode(code);
    if (!discountCode) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    // Có thể bổ sung thêm các điều kiện kiểm tra khác ở đây
    return { isValid: true, discountCode };
  },
  applyDiscountCode: async (code: string, orderValue: number, userId: number) => {
    if (!code || !orderValue || !userId) throw new Error('Thiếu thông tin cần thiết');
    if (orderValue <= 0) throw new Error('Giá trị đơn hàng phải lớn hơn 0');
    const discountCode = await discountCodeRepository.findByCode(code);
    if (!discountCode) throw new Error('Mã giảm giá không tồn tại hoặc đã hết hiệu lực');
    // Kiểm tra số lượt sử dụng
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }
    // Kiểm tra giá trị đơn hàng tối thiểu
    if (discountCode.minOrderValue && orderValue < discountCode.minOrderValue) {
      throw new Error(`Đơn hàng phải có giá trị tối thiểu ${discountCode.minOrderValue.toLocaleString('vi-VN')}đ`);
    }
    // Tính toán số tiền được giảm
    let discountAmount = 0;
    if (discountCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderValue * discountCode.discountValue) / 100;
      if (discountCode.maxDiscount && discountAmount > discountCode.maxDiscount) {
        discountAmount = discountCode.maxDiscount;
      }
    } else {
      discountAmount = discountCode.discountValue;
    }
    return {
      isValid: true,
      discountCode,
      discountAmount,
      finalAmount: orderValue - discountAmount
    };
  },
  getClaimedCodes: async (userId: number) => {
    return discountCodeRepository.getClaimedCodes(userId);
  },
}; 