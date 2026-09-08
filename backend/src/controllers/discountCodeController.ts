import type { Request, Response } from 'express';
import { discountCodeService } from '../services/discountCodeService';
import { handleControllerError, ErrorCodes } from '../common/types/api-response';
import { parsePageOptions } from '../common/types/pagination';

export const getAllDiscountCodes = async (req: Request, res: Response) => {
  try {
    const pagination = parsePageOptions(req.query);
    const result = await discountCodeService.getAll({ page: pagination.page, limit: pagination.limit });
    res.apiSuccess(result.items, "Lấy danh sách mã giảm giá thành công", 200, result.pagination);
  } catch (error) {
    handleControllerError(res, error, "getAllDiscountCodes");
  }
};

export const getDiscountCodeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.getById(Number(id));
    if (!discountCode) {
      res.apiError('Discount code not found', ErrorCodes.NOT_FOUND);
      return;
    }
    res.apiSuccess(discountCode, "Lấy mã giảm giá thành công");
  } catch (error) {
    handleControllerError(res, error, "getDiscountCodeById");
  }
};

export const createDiscountCode = async (req: Request, res: Response) => {
  try {
    const discountCode = await discountCodeService.create(req.body);
    res.apiSuccess(discountCode, "Tạo mã giảm giá thành công", 201);
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "createDiscountCode");
  }
};

export const updateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountCode = await discountCodeService.update(Number(id), req.body);
    res.apiSuccess(discountCode, "Cập nhật mã giảm giá thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "updateDiscountCode");
  }
};

export const deleteDiscountCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await discountCodeService.delete(Number(id));
    res.apiSuccess(null, "Xóa mã giảm giá thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "deleteDiscountCode");
  }
};

export const validateDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      res.apiError('Mã giảm giá là bắt buộc', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!userId) {
      res.apiError('Vui lòng đăng nhập để sử dụng mã giảm giá', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const result = await discountCodeService.validateAndApply(code, userId);
    res.apiSuccess(result, "Mã giảm giá hợp lệ");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "validateDiscountCode");
  }
};

export const saveDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { discountCodeId, orderId } = req.body;
    const userId = req.user?.id;

    if (!userId || !discountCodeId || !orderId) {
      res.apiError('Thiếu thông tin cần thiết', ErrorCodes.BAD_REQUEST);
      return;
    }

    await discountCodeService.saveDiscountCodeUsage(userId, discountCodeId, orderId);
    res.apiSuccess(null, "Đã lưu thông tin sử dụng mã giảm giá");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "saveDiscountCodeUsage");
  }
};

export const applyDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user?.id;

    if (!code || !orderValue) {
      res.apiError('Mã giảm giá và giá trị đơn hàng là bắt buộc', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!userId) {
      res.apiError('Vui lòng đăng nhập để sử dụng mã giảm giá', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const result = await discountCodeService.applyDiscountCode(code, orderValue, userId);
    res.apiSuccess(result, "Áp dụng mã giảm giá thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "applyDiscountCode");
  }
};

export const resetDiscountCodeUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await discountCodeService.resetUsage(Number(id));
    res.apiSuccess(result, "Reset số lần sử dụng thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "resetDiscountCodeUsage");
  }
};

export const getClaimedDiscountCodes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.apiError('Vui lòng đăng nhập để xem mã giảm giá đã nhận', ErrorCodes.UNAUTHORIZED);
      return;
    }

    const claimedCodes = await discountCodeService.getClaimedCodes(userId);
    const formattedCodes = claimedCodes.map(claim => ({
      ...claim.discountCode,
      claimedAt: claim.claimedAt,
      isUsed: claim.isUsed
    }));

    res.apiSuccess(formattedCodes, "Lấy danh sách mã giảm giá đã nhận thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "getClaimedDiscountCodes");
  }
};

export const claimDiscountCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.id;

    if (!code) {
      res.apiError('Mã giảm giá là bắt buộc', ErrorCodes.BAD_REQUEST);
      return;
    }

    if (!userId) {
      res.apiError('Vui lòng đăng nhập để nhận mã giảm giá', ErrorCodes.UNAUTHORIZED);
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

    res.apiSuccess(formattedResult, "Nhận mã giảm giá thành công");
  } catch (error) {
    if (error instanceof Error) {
      res.apiError(error.message, ErrorCodes.BAD_REQUEST);
      return;
    }
    handleControllerError(res, error, "claimDiscountCode");
  }
};
