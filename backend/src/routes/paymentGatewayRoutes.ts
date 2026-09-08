import express from 'express';
import {
  createGatewayPaymentController,
  completeGatewayPaymentController,
  failGatewayPaymentController,
  cancelGatewayPaymentController,
} from '../controllers/paymentGatewayController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/deposit', authenticate, createGatewayPaymentController);
router.post('/:id/complete', authenticate, completeGatewayPaymentController);
router.post('/:id/fail', authenticate, failGatewayPaymentController);
router.post('/:id/cancel', authenticate, cancelGatewayPaymentController);

export default router;
