import express from 'express';
import {
  getAllTopUpPackagesController,
  getActiveTopUpPackagesController,
  getTopUpPackageByIdController,
  createTopUpPackageController,
  updateTopUpPackageController,
  deleteTopUpPackageController,
} from '../controllers/topUpPackageController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllTopUpPackagesController);
router.get('/active', getActiveTopUpPackagesController);
router.get('/:id', getTopUpPackageByIdController);
router.post('/', authenticate, requireAdmin, createTopUpPackageController);
router.put('/:id', authenticate, requireAdmin, updateTopUpPackageController);
router.delete('/:id', authenticate, requireAdmin, deleteTopUpPackageController);

export default router;
