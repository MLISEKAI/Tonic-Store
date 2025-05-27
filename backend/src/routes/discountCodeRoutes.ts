import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllDiscountCodes,
  getDiscountCodeById,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  validateDiscountCode
} from '../controllers/discountCodeController';

const router = express.Router();

// Public routes
router.post('/validate', validateDiscountCode);

// Protected routes (require authentication)
router.use(authenticate);
router.get('/', getAllDiscountCodes);
router.get('/:id', getDiscountCodeById);
router.post('/', createDiscountCode);
router.put('/:id', updateDiscountCode);
router.delete('/:id', deleteDiscountCode);

export default router; 