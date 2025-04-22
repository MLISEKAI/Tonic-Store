import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '../controllers/categoryController';

const router = express.Router();

// Public routes
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);

// Admin routes
router.post('/', authenticate, requireAdmin, createCategoryController);
router.put('/:id', authenticate, requireAdmin, updateCategoryController);
router.delete('/:id', authenticate, requireAdmin, deleteCategoryController);

export default router; 