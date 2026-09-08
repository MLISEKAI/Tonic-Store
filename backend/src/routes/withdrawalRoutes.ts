import { Router } from 'express';
import {
  requestWithdrawalController,
  getMyWithdrawalsController,
  getPendingWithdrawalsController,
  approveWithdrawalController,
  rejectWithdrawalController,
} from '../controllers/withdrawalController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/request', authenticate, requestWithdrawalController);
router.get('/my', authenticate, getMyWithdrawalsController);
router.get('/pending', authenticate, requireAdmin, getPendingWithdrawalsController);
router.post('/:id/approve', authenticate, requireAdmin, approveWithdrawalController);
router.post('/:id/reject', authenticate, requireAdmin, rejectWithdrawalController);

export default router;
