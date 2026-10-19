const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  applyCoupon
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { admin: adminMiddleware } = require('../middleware/adminMiddleware'); // or import from authMiddleware if combined

router.route('/').get(getProducts).post(protect, adminMiddleware, createProduct);
router.route('/search').get(getProducts); // Search is handled in getProducts via query params
router.route('/category/:category').get(getProductsByCategory);
router.route('/:id').get(getProductById).put(protect, adminMiddleware, updateProduct).delete(protect, adminMiddleware, deleteProduct);
router.route('/:id/apply-coupon').post(applyCoupon);

module.exports = router;
