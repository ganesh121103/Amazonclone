const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Private routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats/dashboard', protect, admin, getDashboardStats);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
