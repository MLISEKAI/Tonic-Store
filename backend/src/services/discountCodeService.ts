import { DiscountCodeRepository } from '../repositories';
import { prisma } from '../prisma';
import { CacheService, CacheKeys } from './cache.service';

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
    const cached = await CacheService.get(CacheKeys.DISCOUNT_CODE_ALL());
    if (cached) return cached;

    const codes = await discountCodeRepository.findAll();
    await CacheService.set(CacheKeys.DISCOUNT_CODE_ALL(), codes, 300);
    return codes;
  },
  getById: async (id: number) => {
    const cacheKey = CacheKeys.DISCOUNT_CODE_DETAIL(id);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const code = await discountCodeRepository.findById(id);
    if (code) {
      await CacheService.set(cacheKey, code, 300);
    }
    return code;
  },
  getByCode: async (code: string) => {
    const cacheKey = CacheKeys.DISCOUNT_CODE_BY_CODE(code);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const discountCode = await discountCodeRepository.findByCode(code);
    if (discountCode) {
      await CacheService.set(cacheKey, discountCode, 300);
    }
    return discountCode;
  },
  create: async (data: any) => {
    const code = await discountCodeRepository.create(data);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    return code;
  },
  update: async (id: number, data: any) => {
    const code = await discountCodeRepository.update(id, data);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_DETAIL(id));
    return code;
  },
  delete: async (id: number) => {
    const code = await discountCodeRepository.delete(id);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_DETAIL(id));
    return code;
  },
  claimDiscountCode: async (code: string, userId: number) => {
    const result = await discountCodeRepository.claimDiscountCode(code, userId);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_CLAIMED(userId));
    return result;
  },
  saveDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    const result = await discountCodeRepository.saveDiscountCodeUsage(userId, discountCodeId, orderId);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_CLAIMED(userId));
    return result;
  },
  checkUserUsage: async (userId: number, discountCodeId: number) => {
    return discountCodeRepository.checkUserUsage(userId, discountCodeId);
  },
  updateDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    const result = await discountCodeRepository.updateDiscountCodeUsage(userId, discountCodeId, orderId);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_CLAIMED(userId));
    return result;
  },
  resetUsage: async (id: number) => {
    const result = await discountCodeRepository.resetUsage(id);
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_ALL());
    await CacheService.delete(CacheKeys.DISCOUNT_CODE_DETAIL(id));
    return result;
  },
  validateAndApply: async (code: string, _userId: number) => {
    const cacheKey = CacheKeys.DISCOUNT_CODE_BY_CODE(code);
    const cached = await CacheService.get(cacheKey);
    if (cached) return { isValid: true, discountCode: cached };

    const discountCode = await discountCodeRepository.findByCode(code);
    if (!discountCode) throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    if (discountCode) {
      await CacheService.set(cacheKey, discountCode, 300);
    }
    return { isValid: true, discountCode };
  },
  applyDiscountCode: async (code: string, orderValue: number, userId: number) => {
    if (!code || !orderValue || !userId) throw new Error('Thiếu thông tin cần thiết');
    if (orderValue <= 0) throw new Error('Giá trị đơn hàng phải lớn hơn 0');
    const discountCode = await discountCodeRepository.findByCode(code);
    if (!discountCode) throw new Error('Mã giảm giá không tồn tại hoặc đã hết hiệu lực');

    const hasUsed = await discountCodeRepository.checkUserUsage(userId, discountCode.id);
    if (hasUsed) {
      throw new Error('Bạn đã sử dụng mã giảm giá này rồi. Mỗi tài khoản chỉ được sử dụng 1 lần.');
    }

    const claim = await prisma.discountCodeClaim.findFirst({
      where: { userId, discountCodeId: discountCode.id, isUsed: false }
    });
    if (!claim) {
      throw new Error('Bạn chưa nhận mã giảm giá này. Vui lòng nhận mã trước khi sử dụng.');
    }

    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }
    if (discountCode.minOrderValue && orderValue < discountCode.minOrderValue) {
      throw new Error(`Đơn hàng phải có giá trị tối thiểu ${discountCode.minOrderValue.toLocaleString('vi-VN')}đ`);
    }
    let discountAmount: number;
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
    const cacheKey = CacheKeys.DISCOUNT_CODE_CLAIMED(userId);
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const codes = await discountCodeRepository.getClaimedCodes(userId);
    await CacheService.set(cacheKey, codes, 300);
    return codes;
  },
};