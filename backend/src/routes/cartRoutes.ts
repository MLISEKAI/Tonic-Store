import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as cartController from '../controllers/cartController';

const router = Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log('Cart Route:', req.method, req.path);
  console.log('Request body:', req.body);
  next();
});

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/update/:itemId', authenticate, cartController.updateCartItem);
router.delete('/remove/:itemId', authenticate, cartController.removeFromCart);
router.delete('/clear', authenticate, cartController.clearCart);

export default router;
