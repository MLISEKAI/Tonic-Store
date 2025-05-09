import express from 'express';
import { authenticate } from '../middleware/auth';
import { ShipperController } from '../controllers/shipperController';

const router = express.Router();

// Lấy danh sách đơn hàng của shipper
router.get('/orders', authenticate, ShipperController.getShipperOrders);

// Lấy lịch sử giao hàng của đơn hàng
router.get('/orders/:orderId/logs', authenticate, ShipperController.getOrderDeliveryLogs);

// Cập nhật trạng thái giao hàng (shipper only)
router.patch('/orders/:orderId/status', authenticate, ShipperController.updateDeliveryStatus);

// Gán shipper cho đơn hàng (admin only)
router.post('/orders/:orderId/assign', authenticate, ShipperController.assignShipperToOrder);

// Lấy danh sách shipper (admin only)
router.get('/', authenticate, ShipperController.getAllShippers);

// Lấy thông tin chi tiết shipper
router.get('/:id', authenticate, ShipperController.getShipperById);

export default router; 