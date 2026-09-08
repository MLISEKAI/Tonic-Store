import { Router } from 'express';
import {
  getWalletController,
  topUpController,
  deductController,
  refundController,
  getTransactionHistoryController,
} from '../controllers/walletController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWalletController);
router.post('/topup', authenticate, topUpController);
router.post('/deduct', authenticate, deductController);
router.post('/refund', authenticate, refundController);
router.get('/transactions', authenticate, getTransactionHistoryController);

export default router;
