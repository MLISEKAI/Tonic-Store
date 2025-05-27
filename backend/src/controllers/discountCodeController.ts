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
    const { code, orderValue } = req.body;
    
    if (!code || !orderValue) {
      return res.status(400).json({ 
        message: 'Discount code and order value are required' 
      });
    }

    const result = await discountCodeService.validateAndApply(code, orderValue);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to validate discount code' });
    }
  }
}; 