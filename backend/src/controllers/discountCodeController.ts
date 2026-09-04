import type { Request, Response } from 'express';
import { discountCodeService } from '../services/discountCodeService';

// Lấy tất cả mã giảm giá
export const getAllDiscountCodes = async (_req: Request, res: Response) => {
  try {
    const discountCodes = await discountCodeService.getAll();
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
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: 'Failed to get discount codes' });
  }
};

export const getDiscountCodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.getById(Number(id));

    if (!discountCode) {
      res.status(404).json({ message: 'Discount code not found' });
      return;
    }

    res.json(discountCode);
  } catch { logger.error('Error', { err: (error as Error).message }); res.status(500).json({ message: 'Failed to get discount code' });
  }
};

export const createDiscountCode = async (req: Request, res: Response) => {
  try {
    const discountCode = await discountCodeService.create(req.body);
    res.status(201).json(discountCode);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create discount code' });
    }
  }
};

export const updateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.update(Number(id), req.body);
    res.json(discountCode);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update discount code' });
    }
  }
};

export const deleteDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await discountCodeService.delete(Number(id));
    res.status(204).send();
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to delete discount code' });
    }
  }
};

export const validateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      res.status(400).json({ message: 'Mã giảm giá là bắt buộc' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng mã giảm giá' });
      return;
    }

    const result = await discountCodeService.validateAndApply(code, userId);
    res.json(result);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể xác thực mã giảm giá' });
    }
  }
};

export const saveDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { discountCodeId, orderId } = req.body;
    const userId = req.user?.id;

    if (!userId || !discountCodeId || !orderId) {
      res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
      return;
    }

    await discountCodeService.saveDiscountCodeUsage(userId, discountCodeId, orderId);
    res.status(200).json({ message: 'Đã lưu thông tin sử dụng mã giảm giá' });
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể lưu thông tin sử dụng mã giảm giá' });
    }
  }
};

export const applyDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user?.id;

    if (!code || !orderValue) {
      res.status(400).json({ message: 'Mã giảm giá và giá trị đơn hàng là bắt buộc' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Vui lòng đăng nhập để sử dụng mã giảm giá' });
      return;
    }

    const result = await discountCodeService.applyDiscountCode(code, orderValue, userId);
    res.json(result);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể áp dụng mã giảm giá' });
    }
  }
};

export const resetDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await discountCodeService.resetUsage(Number(id));
    res.json(result);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể reset số lần sử dụng' });
    }
  }
};

export const getClaimedDiscountCodes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Vui lòng đăng nhập để xem mã giảm giá đã nhận' });
      return;
    }

    const claimedCodes = await discountCodeService.getClaimedCodes(userId);

    const formattedCodes = claimedCodes.map(claim => ({
      ...claim.discountCode,
      claimedAt: claim.claimedAt,
      isUsed: claim.isUsed
    }));

    res.json(formattedCodes);
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể lấy danh sách mã giảm giá đã nhận' });
    }
  }
};

export const claimDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      res.status(400).json({ message: 'Mã giảm giá là bắt buộc' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Vui lòng đăng nhập để nhận mã giảm giá' });
      return;
    }

    const result = await discountCodeService.claimDiscountCode(code, userId);

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
  } catch {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Không thể nhận mã giảm giá' });
    }
  }
};
