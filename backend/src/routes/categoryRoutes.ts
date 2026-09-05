import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { cacheMiddleware } from '../services/cache-middleware';
import { CacheKeys } from '../services/cache.service';
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '../controllers/categoryController';

const router = express.Router();

// Public routes
router.get('/', cacheMiddleware({
  ttl: 600,
  keyGenerator: () => `cache:${CacheKeys.CATEGORY_LIST()}`,
}), getAllCategoriesController);
router.get('/:id', cacheMiddleware({
  ttl: 600,
  keyGenerator: (req) => `cache:${CacheKeys.CATEGORY_DETAIL(Number(req.params.id))}`,
}), getCategoryByIdController);

// Admin routes
router.post('/', authenticate, requireAdmin, createCategoryController);
router.put('/:id', authenticate, requireAdmin, updateCategoryController);
router.delete('/:id', authenticate, requireAdmin, deleteCategoryController);

export default router; 