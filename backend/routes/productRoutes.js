const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/top', getTopProducts);
router.get('/admin', protect, admin, getAdminProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Private
router.post('/:id/reviews', protect, createProductReview);

// Admin
router.post('/', protect, admin, createProduct);
router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
