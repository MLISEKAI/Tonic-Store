import { prisma } from '../prisma';
import { BaseRepository } from './BaseRepository';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }
  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }

  async findUsersWithSelect(select: any): Promise<any[]> {
    return prisma.user.findMany({ 
      select,
      where: {
        // Chỉ lấy người dùng chưa bị xóa (deletedAt = null)
        deletedAt: null
      }
    });
  }

  async findUserByIdWithSelect(id: number, select: any): Promise<any | null> {
    return prisma.user.findUnique({ where: { id }, select });
  }

  async updateUserWithSelect(id: number, data: any, select: any): Promise<any> {
    return prisma.user.update({ where: { id }, data, select });
  }

  async createPasswordChangeLog(userId: number, adminId: number): Promise<any> {
    return prisma.passwordChangeLog.create({
      data: {
        userId,
        adminId,
      },
    });
  }

  async updateUserPasswordWithLog(userId: number, adminId: number, hashedPassword: string, select: any): Promise<any> {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        select,
      }),
      prisma.passwordChangeLog.create({
        data: {
          userId,
          adminId,
        },
      }),
    ]);
  }

  async checkRelatedRecords(userId: number): Promise<{ hasRelated: boolean; relatedTypes: string[] }> {
    const relatedTypes: string[] = [];

    const [orders, shipperOrders, reviews, deliveryLogs, deliveryRatings, shippingAddresses, wishlist, notifications, 
           discountCodeUsages, discountCodeClaims, passwordChangeLogsAsUser, passwordChangeLogsAsAdmin, cart] = await Promise.all([
      prisma.order.findFirst({ where: { userId } }),
      prisma.order.findFirst({ where: { shipperId: userId } }),
      prisma.review.findFirst({ where: { userId } }),
      prisma.deliveryLog.findFirst({ where: { deliveryId: userId } }),
      prisma.deliveryRating.findFirst({ where: { userId } }),
      prisma.shippingAddress.findFirst({ where: { userId } }),
      prisma.wishlist.findFirst({ where: { userId } }),
      prisma.notification.findFirst({ where: { userId } }),
      prisma.discountCodeUsage.findFirst({ where: { userId } }),
      prisma.discountCodeClaim.findFirst({ where: { userId } }),
      prisma.passwordChangeLog.findFirst({ where: { userId } }),
      prisma.passwordChangeLog.findFirst({ where: { adminId: userId } }),
      prisma.cart.findFirst({ where: { userId } }),
    ]);

    if (orders) relatedTypes.push('đơn hàng (khách hàng)');
    if (shipperOrders) relatedTypes.push('đơn hàng (shipper)');
    if (reviews) relatedTypes.push('đánh giá');
    if (deliveryLogs) relatedTypes.push('log giao hàng');
    if (deliveryRatings) relatedTypes.push('đánh giá giao hàng');
    if (shippingAddresses) relatedTypes.push('địa chỉ giao hàng');
    if (wishlist) relatedTypes.push('danh sách yêu thích');
    if (notifications) relatedTypes.push('thông báo');
    if (discountCodeUsages) relatedTypes.push('sử dụng mã giảm giá');
    if (discountCodeClaims) relatedTypes.push('claim mã giảm giá');
    if (passwordChangeLogsAsUser) relatedTypes.push('log thay đổi mật khẩu (người dùng)');
    if (passwordChangeLogsAsAdmin) relatedTypes.push('log thay đổi mật khẩu (quản trị viên)');
    if (cart) relatedTypes.push('giỏ hàng');

    return {
      hasRelated: relatedTypes.length > 0,
      relatedTypes,
    };
  }

  /**
   * Force delete user với soft delete approach
   * - Xóa các dữ liệu không quan trọng (cart, wishlist, notifications, etc.)
   * - Giữ lại Orders để dashboard vẫn có dữ liệu mua hàng
   * - Anonymize user data và đánh dấu deletedAt, deletedBy
   * 
   * @param userId - ID của user cần xóa
   * @param deletedBy - ID của admin thực hiện xóa
   */
  async forceDelete(userId: number, deletedBy: number): Promise<void> {
    // Tạo bcrypt hash random cho password placeholder
    // Dùng salt rounds = 10 (standard)
    const randomPassword = `DELETED_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Sử dụng Prisma interactive transaction (callback style)
    // Prisma 6.x+ hỗ trợ async callback với transaction isolation
    await prisma.$transaction(async (tx) => {
      // ===== BƯỚC 1: XÓA DỮ LIỆU KHÔNG QUAN TRỌNG =====
      
      // 1.1. Xóa giỏ hàng và cart items
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.cart.delete({ where: { id: cart.id } });
      }

      // 1.2. Xóa danh sách yêu thích
      await tx.wishlist.deleteMany({ where: { userId } });

      // 1.3. Xóa thông báo
      await tx.notification.deleteMany({ where: { userId } });

      // 1.4. Xóa địa chỉ giao hàng
      await tx.shippingAddress.deleteMany({ where: { userId } });

      // 1.5. Xóa sử dụng mã giảm giá
      await tx.discountCodeUsage.deleteMany({ where: { userId } });
      await tx.discountCodeClaim.deleteMany({ where: { userId } });

      // 1.6. Xóa log thay đổi mật khẩu (cả khi user là user hoặc admin)
      await tx.passwordChangeLog.deleteMany({ 
        where: { 
          OR: [
            { userId },
            { adminId: userId }
          ]
        }
      });

      // 1.7. Xóa delivery logs nếu user là shipper
      await tx.deliveryLog.deleteMany({ where: { deliveryId: userId } });

      // 1.8. Xóa delivery ratings (phải xóa trước do foreign key constraint)
      await tx.deliveryRating.deleteMany({ where: { userId } });

      // 1.9. Xóa reviews (có RESTRICT constraint nên phải xóa trước)
      await tx.review.deleteMany({ where: { userId } });

      // ===== BƯỚC 2: CẬP NHẬT DỮ LIỆU QUAN TRỌNG (GIỮ LẠI CHO DASHBOARD) =====
      
      // 2.1. Cập nhật orders: set shipperId = null nếu user là shipper
      // Orders với userId sẽ được giữ lại để dashboard vẫn có dữ liệu mua hàng
      await tx.order.updateMany({
        where: { shipperId: userId },
        data: { shipperId: null }
      });

      // ===== BƯỚC 3: ANONYMIZE USER DATA (SOFT DELETE) =====
      // Không thể hard delete vì Order.userId có RESTRICT constraint
      // Giữ lại user record để dashboard vẫn có thể join với orders
      
      const timestamp = Date.now();
      await tx.user.update({
        where: { id: userId },
        data: {
          // Anonymize thông tin cá nhân
          name: `[Đã xóa] ${timestamp}`,
          email: `deleted_${userId}_${timestamp}@deleted.local`,
          password: hashedPassword, // Bcrypt hash random
          phone: null,
          address: null,
          // Đánh dấu soft delete
          deletedAt: new Date(),
          deletedBy: deletedBy,
        }
      });

      // ===== GHI CHÚ =====
      // Nếu muốn hard delete thực sự (xóa hoàn toàn user record):
      // 1. Tạo migration thay đổi Order.userId foreign key từ RESTRICT → SET NULL
      // 2. Cập nhật schema.prisma: Order.userId Int? (nullable)
      // 3. Thay thế tx.user.update bằng: await tx.user.delete({ where: { id: userId } });
      // Tuy nhiên điều này sẽ làm mất mối quan hệ order-user trong dashboard
    }, {
      // Transaction options (optional, Prisma sẽ dùng default isolation level của database)
      timeout: 30000, // 30 seconds timeout
    });
  }
} 