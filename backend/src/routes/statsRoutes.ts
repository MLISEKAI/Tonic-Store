import { Router } from 'express';
import { getStats, getSalesByDateHandler, getTopCustomersHandler } from '../controllers/statsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getStats);
router.get('/sales', authenticate, getSalesByDateHandler);
router.get('/top-customers', authenticate, getTopCustomersHandler);

export default router; 