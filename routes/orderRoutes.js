const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/orders — paginated order list for authenticated user
router.get('/orders', authMiddleware, orderController.getOrders);

// GET /api/orders/:orderId — full order details (buyer or seller)
router.get('/orders/:orderId', authMiddleware, orderController.getOrderById);

// PATCH /api/orders/:orderId/status — update order status (seller/admin)
router.patch('/orders/:orderId/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
