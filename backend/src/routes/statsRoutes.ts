import { Router } from 'express';
import { getStats } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getStats);

export default router; 