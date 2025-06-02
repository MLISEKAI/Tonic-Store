import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllDiscountCodes,
  getDiscountCodeById,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  validateDiscountCode,
  saveDiscountCodeUsage,
  applyDiscountCode,
  resetDiscountCodeUsage
} from '../controllers/discountCodeController';

const router = express.Router();

// Public routes
router.post('/validate', authenticate, validateDiscountCode);
router.post('/apply', authenticate, applyDiscountCode);

// Protected routes (require authentication)
router.use(authenticate);
router.get('/', getAllDiscountCodes);
router.get('/:id', getDiscountCodeById);
router.post('/', createDiscountCode);
router.put('/:id', updateDiscountCode);
router.delete('/:id', deleteDiscountCode);
router.post('/usage', saveDiscountCodeUsage);
router.post('/:id/reset', resetDiscountCodeUsage);

export default router; 