import { Request, Response } from 'express';
import { discountCodeService } from '../services/discountCodeService';

export const getAllDiscountCodes = async (req: Request, res: Response) => {
  try {
    const discountCodes = await discountCodeService.getAll();
    res.json(discountCodes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get discount codes' });
  }
};

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

// Thêm controller mới để lưu thông tin sử dụng mã
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

// Thêm controller mới để áp dụng mã giảm giá trong checkout
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