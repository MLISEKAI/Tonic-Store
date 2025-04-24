import express from 'express';
import { authenticate } from '../middleware/auth';
import * as shippingAddressController from '../controllers/shippingAddressController';

const router = express.Router();

// Protected routes
router.use(authenticate);

// Get all shipping addresses
router.get('/', shippingAddressController.getShippingAddresses);

// Get a specific shipping address
router.get('/:id', shippingAddressController.getShippingAddress);

// Create a new shipping address
router.post('/', shippingAddressController.createShippingAddress);

// Update a shipping address
router.put('/:id', shippingAddressController.updateShippingAddress);

// Delete a shipping address
router.delete('/:id', shippingAddressController.deleteShippingAddress);

// Set default shipping address
router.post('/:id/default', shippingAddressController.setDefaultShippingAddress);

export default router; 