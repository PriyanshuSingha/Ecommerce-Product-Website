const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  createPaymentOrder,
  verifyPayment,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, getMyOrders);
router.route('/payment/create').post(protect, createPaymentOrder);
router.route('/payment/verify').post(protect, verifyPayment);
router.route('/admin').get(protect, admin, getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
