import type { Request, Response } from 'express';
import { discountCodeService } from '../services/discountCodeService';

// Lấy tất cả mã giảm giá
export const getAllDiscountCodes = async (req: Request, res: Response) => {
  try {
    const discountCodes = await discountCodeService.getAll();
    // Map lại trường cho đúng format frontend mong đợi
    const formattedCodes = discountCodes.map((code: any) => ({
      id: code.id,
      code: code.code,
      description: code.description,
      type: code.discountType,
      discount: code.discountValue,
      minOrderValue: code.minOrderValue,
      maxDiscount: code.maxDiscount,
      startDate: code.startDate instanceof Date ? code.startDate.toISOString() : code.startDate,
      endDate: code.endDate instanceof Date ? code.endDate.toISOString() : code.endDate,
      usageLimit: code.usageLimit,
      usedCount: code.usedCount,
      isActive: code.isActive
    }));
    res.json(formattedCodes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get discount codes' });
  }
};

// Lấy mã giảm giá theo ID
export const getDiscountCodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.getById(Number(id));
    
    if (!discountCode) {
      return res.status(404).json({ message: 'Discount code not found' });
    }
    
    res.json(discountCode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get discount code' });
  }
};

// Tạo mã giảm giá
export const createDiscountCode = async (req: Request, res: Response) => {
  try {
    const discountCode = await discountCodeService.create(req.body);
    res.status(201).json(discountCode);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create discount code' });
    }
  }
};

// Cập nhật mã giảm giá
export const updateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.update(Number(id), req.body);
    res.json(discountCode);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update discount code' });
    }
  }
};

// Xóa mã giảm giá
export const deleteDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await discountCodeService.delete(Number(id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete discount code' });
    }
  }
};

// Kiểm tra và áp dụng mã giảm giá
export const validateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      return res.status(400).json({
        message: 'Mã giảm giá là bắt buộc'
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: 'Vui lòng đăng nhập để sử dụng mã giảm giá'
      });
    }

    const result = await discountCodeService.validateAndApply(code, userId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể xác thực mã giảm giá' });
    }
  }
};

// Lưu thông tin sử dụng mã
export const saveDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { discountCodeId, orderId } = req.body;
    const userId = req.user?.id;

    if (!userId || !discountCodeId || !orderId) {
      return res.status(400).json({
        message: 'Thiếu thông tin cần thiết'
      });
    }

    await discountCodeService.saveDiscountCodeUsage(userId, discountCodeId, orderId);
    res.status(200).json({ message: 'Đã lưu thông tin sử dụng mã giảm giá' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể lưu thông tin sử dụng mã giảm giá' });
    }
  }
};

// Áp dụng mã giảm giá trong checkout
export const applyDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user?.id;
    
    if (!code || !orderValue) {
      return res.status(400).json({ 
        message: 'Mã giảm giá và giá trị đơn hàng là bắt buộc' 
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: 'Vui lòng đăng nhập để sử dụng mã giảm giá'
      });
    }

    const result = await discountCodeService.applyDiscountCode(code, orderValue, userId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể áp dụng mã giảm giá' });
    }
  }
};

// Reset số lần sử dụng
export const resetDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await discountCodeService.resetUsage(Number(id));
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể reset số lần sử dụng' });
    }
  }
};

// Lấy danh sách mã giảm giá đã nhận của user
export const getClaimedDiscountCodes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Vui lòng đăng nhập để xem mã giảm giá đã nhận'
      });
    }

    console.log('Getting claimed codes for user:', userId);
    const claimedCodes = await discountCodeService.getClaimedCodes(userId);
    console.log('Claimed codes:', claimedCodes);
    
    // Format lại dữ liệu trả về
    const formattedCodes = claimedCodes.map(claim => ({
      ...claim.discountCode,
      claimedAt: claim.claimedAt,
      isUsed: claim.isUsed
    }));

    console.log('Formatted codes:', formattedCodes);
    res.json(formattedCodes);
  } catch (error) {
    console.error('Error getting claimed codes:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể lấy danh sách mã giảm giá đã nhận' });
    }
  }
};

// Nhận mã giảm giá
export const claimDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      return res.status(400).json({
        message: 'Mã giảm giá là bắt buộc'
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: 'Vui lòng đăng nhập để nhận mã giảm giá'
      });
    }

    console.log('Claiming discount code:', { code, userId });
    const result = await discountCodeService.claimDiscountCode(code, userId);
    console.log('Claim result:', result);

    // Format lại dữ liệu trả về theo đúng format frontend mong đợi
    const formattedResult = {
      isValid: true,
      discountCode: {
        id: result.id,
        code: result.code,
        description: result.description,
        type: result.discountType,
        discount: result.discountValue,
        minOrderValue: result.minOrderValue,
        maxDiscount: result.maxDiscount,
        startDate: result.startDate.toISOString(),
        endDate: result.endDate.toISOString(),
        usageLimit: result.usageLimit,
        usedCount: result.usedCount,
        isActive: result.isActive
      }
    };

    res.json(formattedResult);
  } catch (error) {
    console.error('Error claiming discount code:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể nhận mã giảm giá' });
    }
  }
}; 