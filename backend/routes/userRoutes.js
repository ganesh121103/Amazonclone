const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  addAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (authenticated users)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/wishlist/:productId', protect, toggleWishlist);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Admin routes
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
