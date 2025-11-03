import { DiscountCodeRepository } from '../repositories';
import { prisma } from '../prisma';

const discountCodeRepository = new DiscountCodeRepository();

/**
 * Helper function để xử lý discount code usage khi order được tạo/thanh toán thành công
 * @param promotionCode - Mã giảm giá
 * @param userId - ID của user
 * @param orderId - ID của order
 */
export const processDiscountCodeUsage = async (
  promotionCode: string | null | undefined,
  userId: number,
  orderId: number
): Promise<void> => {
  if (!promotionCode) {
    console.log('[processDiscountCodeUsage] No promotion code provided');
    return;
  }

  try {
    console.log(`[processDiscountCodeUsage] Processing code: ${promotionCode}, userId: ${userId}, orderId: ${orderId}`);
    
    // Tìm mã giảm giá theo code
    const discountCode = await prisma.discountCode.findFirst({
      where: { code: promotionCode }
    });

    if (!discountCode) {
      console.log(`[processDiscountCodeUsage] Discount code not found: ${promotionCode}`);
      return;
    }

    console.log(`[processDiscountCodeUsage] Found discount code ID: ${discountCode.id}`);

    // Tìm claim của mã giảm giá này (chưa dùng)
    const claim = await prisma.discountCodeClaim.findFirst({
      where: {
        userId,
        discountCodeId: discountCode.id,
        isUsed: false
      }
    });

    if (!claim) {
      console.log(`[processDiscountCodeUsage] No unused claim found for userId: ${userId}, codeId: ${discountCode.id}`);
      return;
    }

    console.log(`[processDiscountCodeUsage] Found claim ID: ${claim.id}`);

    // Kiểm tra xem đã có usage chưa (tránh duplicate)
    const existingUsage = await prisma.discountCodeUsage.findFirst({
      where: {
        userId,
        discountCodeId: discountCode.id,
        orderId
      }
    });

    if (existingUsage) {
      console.log(`[processDiscountCodeUsage] Usage already exists for orderId: ${orderId}`);
      return;
    }

    // Sử dụng transaction để đảm bảo tính nhất quán
    await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái sử dụng của claim
      await tx.discountCodeClaim.update({
        where: { id: claim.id },
        data: { isUsed: true }
      });
      console.log(`[processDiscountCodeUsage] Updated claim ${claim.id} to isUsed: true`);

      // Tạo bản ghi sử dụng
      await tx.discountCodeUsage.create({
        data: {
          userId,
          discountCodeId: discountCode.id,
          orderId
        }
      });
      console.log(`[processDiscountCodeUsage] Created DiscountCodeUsage for orderId: ${orderId}`);

      // Tăng số lượt sử dụng của mã
      await tx.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedCount: {
            increment: 1
          }
        }
      });
      console.log(`[processDiscountCodeUsage] Incremented usedCount for discount code ${discountCode.id}`);
    });

    console.log(`[processDiscountCodeUsage] Successfully processed discount code usage for ${promotionCode}`);
  } catch (error) {
    // Log error nhưng không throw để không làm fail order creation
    console.error('[processDiscountCodeUsage] Error processing discount code usage:', error);
  }
};

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
    
    // Kiểm tra user đã dùng mã này chưa (mỗi user chỉ dùng 1 lần)
    const hasUsed = await discountCodeRepository.checkUserUsage(userId, discountCode.id);
    if (hasUsed) {
      throw new Error('Bạn đã sử dụng mã giảm giá này rồi. Mỗi tài khoản chỉ được sử dụng 1 lần.');
    }
    
    // Kiểm tra user đã claim mã này chưa
    const claim = await prisma.discountCodeClaim.findFirst({
      where: {
        userId,
        discountCodeId: discountCode.id,
        isUsed: false
      }
    });
    if (!claim) {
      throw new Error('Bạn chưa nhận mã giảm giá này. Vui lòng nhận mã trước khi sử dụng.');
    }
    
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