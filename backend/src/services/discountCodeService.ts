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
  validateAndApply: async (code: string, userId: number) => {
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

    // Kiểm tra xem user đã sử dụng mã này chưa
    const existingUsage = await prisma.discountCodeUsage.findFirst({
      where: {
        userId,
        discountCodeId: discountCode.id
      }
    });

    if (existingUsage) {
      throw new Error('Bạn đã sử dụng mã giảm giá này trước đó');
    }

    return {
      isValid: true,
      discountCode
    };
  },

  // Lưu thông tin sử dụng mã giảm giá
  saveDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    // Tạo bản ghi sử dụng mã
    await prisma.discountCodeUsage.create({
      data: {
        userId,
        discountCodeId,
        orderId
      }
    });

    // Tăng số lượt sử dụng của mã
    await prisma.discountCode.update({
      where: { id: discountCodeId },
      data: {
        usedCount: {
          increment: 1
        }
      }
    });
  },

  // Kiểm tra xem user đã sử dụng mã chưa
  checkUserUsage: async (userId: number, discountCodeId: number) => {
    const usage = await prisma.discountCodeUsage.findFirst({
      where: {
        userId,
        discountCodeId
      }
    });
    return !!usage;
  },

  // Áp dụng mã giảm giá trong checkout
  applyDiscountCode: async (code: string, orderValue: number, userId: number) => {
    // Kiểm tra tham số đầu vào
    if (!code || !orderValue || !userId) {
      throw new Error('Thiếu thông tin cần thiết');
    }

    if (orderValue <= 0) {
      throw new Error('Giá trị đơn hàng phải lớn hơn 0');
    }

    // Tìm mã giảm giá
    const discountCode = await prisma.discountCode.findFirst({
      where: { 
        code,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });

    if (!discountCode) {
      throw new Error('Mã giảm giá không tồn tại hoặc đã hết hiệu lực');
    }

    // Kiểm tra số lượt sử dụng
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      throw new Error('Mã giảm giá đã hết lượt sử dụng');
    }

    // Kiểm tra xem người dùng đã sử dụng mã này chưa
    const hasUsed = await prisma.discountCodeUsage.findFirst({
      where: {
        userId,
        discountCodeId: discountCode.id
      }
    });

    if (hasUsed) {
      throw new Error('Bạn đã sử dụng mã giảm giá này');
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (discountCode.minOrderValue && orderValue < discountCode.minOrderValue) {
      throw new Error(`Đơn hàng phải có giá trị tối thiểu ${discountCode.minOrderValue.toLocaleString('vi-VN')}đ`);
    }

    // Tính toán số tiền được giảm
    let discountAmount = 0;
    if (discountCode.discountType === 'PERCENTAGE') {
      discountAmount = (orderValue * discountCode.discountValue) / 100;
      // Kiểm tra giới hạn giảm giá tối đa
      if (discountCode.maxDiscount && discountAmount > discountCode.maxDiscount) {
        discountAmount = discountCode.maxDiscount;
      }
    } else {
      discountAmount = discountCode.discountValue;
    }

    // Sử dụng transaction để đảm bảo tính nhất quán của dữ liệu
    return await prisma.$transaction(async (tx) => {
      // Lưu thông tin sử dụng mã
      await tx.discountCodeUsage.create({
        data: {
          userId,
          discountCodeId: discountCode.id,
          orderId: null // Sẽ cập nhật sau khi tạo đơn hàng
        }
      });

      // Tăng số lượt sử dụng của mã
      await tx.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedCount: {
            increment: 1
          }
        }
      });

      return {
        isValid: true,
        discountCode,
        discountAmount,
        finalAmount: orderValue - discountAmount
      };
    });
  },

  // Cập nhật thông tin đơn hàng cho mã giảm giá đã sử dụng
  updateDiscountCodeUsage: async (userId: number, discountCodeId: number, orderId: number) => {
    const usage = await prisma.discountCodeUsage.findFirst({
      where: {
        userId,
        discountCodeId,
        orderId: null
      }
    });

    if (!usage) {
      throw new Error('Không tìm thấy thông tin sử dụng mã giảm giá');
    }

    return prisma.discountCodeUsage.update({
      where: { id: usage.id },
      data: { orderId }
    });
  },

  // Reset số lần sử dụng của mã giảm giá
  resetUsage: async (id: number) => {
    // Kiểm tra mã tồn tại
    const existingCode = await prisma.discountCode.findUnique({
      where: { id }
    });

    if (!existingCode) {
      throw new Error('Mã giảm giá không tồn tại');
    }

    // Sử dụng transaction để đảm bảo tính nhất quán
    return await prisma.$transaction(async (tx) => {
      // Xóa tất cả bản ghi sử dụng mã
      await tx.discountCodeUsage.deleteMany({
        where: { discountCodeId: id }
      });

      // Reset số lần sử dụng về 0
      return tx.discountCode.update({
        where: { id },
        data: {
          usedCount: 0
        }
      });
    });
  }
}; 