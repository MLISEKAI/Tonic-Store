import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  createPaymentController,
  verifyPaymentController,
  getPaymentController,
  refundPaymentController
} from '../controllers/paymentController';

const router = express.Router();

// Public routes
router.get('/verify', verifyPaymentController);

// Protected routes
router.post('/', authenticate, createPaymentController);
router.get('/:id', authenticate, getPaymentController);

// Admin routes
router.post('/:id/refund', authenticate, requireAdmin, refundPaymentController);

export default router;
