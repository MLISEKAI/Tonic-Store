import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as cartController from '../controllers/cartController';

const router = Router();

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/update/:itemId', authenticate, cartController.updateCartItem);
router.delete('/remove/:itemId', authenticate, cartController.removeFromCart);

export default router;
