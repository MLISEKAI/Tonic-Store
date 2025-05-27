import { PrismaClient, DiscountType } from '@prisma/client';
const prisma = new PrismaClient();

export interface CreateDiscountCodeData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  isActive: boolean;
}

export interface UpdateDiscountCodeData extends Partial<CreateDiscountCodeData> {}

export const discountCodeService = {
  // Lấy tất cả mã giảm giá
  getAll: async () => {
    return prisma.discountCode.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Lấy mã giảm giá theo ID
  getById: async (id: number) => {
    return prisma.discountCode.findUnique({
      where: { id }
    });
  },

  // Lấy mã giảm giá theo code
  getByCode: async (code: string) => {
    return prisma.discountCode.findFirst({
      where: { code }
    });
  },

  // Tạo mã giảm giá mới
  create: async (data: CreateDiscountCodeData) => {
    // Kiểm tra code đã tồn tại chưa
    const existingCode = await prisma.discountCode.findFirst({
      where: { code: data.code }
    });

    if (existingCode) {
      throw new Error('Mã giảm giá đã tồn tại');
    }

    // Validate dữ liệu
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
      throw new Error('Giảm giá theo phần trăm không được vượt quá 100%');
    }

    if (data.startDate >= data.endDate) {
      throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
    }

    return prisma.discountCode.create({
      data: {
        ...data,
        usedCount: 0
      }
    });
  },

  // Cập nhật mã giảm giá
  update: async (id: number, data: UpdateDiscountCodeData) => {
    // Kiểm tra mã tồn tại
    const existingCode = await prisma.discountCode.findUnique({
      where: { id }
    });

    if (!existingCode) {
      throw new Error('Mã giảm giá không tồn tại');
    }

    // Nếu có thay đổi code, kiểm tra code mới có bị trùng không
    if (data.code && data.code !== existingCode.code) {
      const duplicateCode = await prisma.discountCode.findFirst({
        where: { code: data.code }
      });

      if (duplicateCode) {
        throw new Error('Mã giảm giá đã tồn tại');
      }
    }

    // Validate dữ liệu
    if (data.discountType === 'PERCENTAGE' && data.discountValue && data.discountValue > 100) {
      throw new Error('Giảm giá theo phần trăm không được vượt quá 100%');
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
    }

    return prisma.discountCode.update({
      where: { id },
      data
    });
  },

  // Xóa mã giảm giá
  delete: async (id: number) => {
    const existingCode = await prisma.discountCode.findUnique({
      where: { id }
    });

    if (!existingCode) {
      throw new Error('Mã giảm giá không tồn tại');
    }

    return prisma.discountCode.delete({
      where: { id }
    });
  },

  // Kiểm tra và áp dụng mã giảm giá
  validateAndApply: async (code: string, orderValue: number) => {
    const discountCode = await prisma.discountCode.findFirst({
      where: {
        code,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });

    if (!discountCode) {
      throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra điều kiện sử dụng
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }

    if (discountCode.minOrderValue && orderValue < discountCode.minOrderValue) {
      throw new Error(`Đơn hàng tối thiểu ${discountCode.minOrderValue}đ để áp dụng mã giảm giá`);
    }

    // Tính giá trị giảm giá
    let discountAmount = 0;
    if (discountCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderValue * discountCode.discountValue) / 100;
    } else {
      discountAmount = discountCode.discountValue;
    }

    // Giới hạn giá trị giảm giá tối đa nếu có
    if (discountCode.maxDiscount) {
      discountAmount = Math.min(discountAmount, discountCode.maxDiscount);
    }

    return {
      discountCode,
      discountAmount
    };
  },

  // Tăng số lượt sử dụng
  incrementUsage: async (id: number) => {
    return prisma.discountCode.update({
      where: { id },
      data: {
        usedCount: {
          increment: 1
        }
      }
    });
  }
}; 