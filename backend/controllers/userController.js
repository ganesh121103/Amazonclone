const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Helper: User response object (strips sensitive data)
const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  avatar: user.avatar,
  addresses: user.addresses,
  wishlist: user.wishlist,
  token,
});

// ─────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
// ─────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    const token = generateToken(user._id);
    res.status(201).json(userResponse(user, token));
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ─────────────────────────────────────────────
// @desc    Authenticate user & return token
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // select password explicitly (it's hidden by default)
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json(userResponse(user, token));
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ─────────────────────────────────────────────
// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
// ─────────────────────────────────────────────
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price rating');
  if (user) {
    res.json(userResponse(user, generateToken(user._id)));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// ─────────────────────────────────────────────
// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
// ─────────────────────────────────────────────
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password; // pre-save hook will hash it
  }
  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }

  const updatedUser = await user.save();
  const token = generateToken(updatedUser._id);
  res.json(userResponse(updatedUser, token));
});

// ─────────────────────────────────────────────
// @desc    Add / remove product from wishlist
// @route   PUT /api/users/wishlist/:productId
// @access  Private
// ─────────────────────────────────────────────
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const index = user.wishlist.indexOf(productId);
  if (index === -1) {
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } else {
    // Remove from wishlist
    user.wishlist.splice(index, 1);
    await user.save();
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  }
});

// ─────────────────────────────────────────────
// @desc    Add / update shipping address
// @route   POST /api/users/addresses
// @access  Private
// ─────────────────────────────────────────────
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fullName, address, city, postalCode, state, country, phone, isDefault } = req.body;

  if (isDefault) {
    // Unset all other defaults
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push({ fullName, address, city, postalCode, state, country, phone, isDefault });
  await user.save();
  res.status(201).json({ addresses: user.addresses });
});

// ─────────────────────────────────────────────
// @desc    Delete a shipping address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
// ─────────────────────────────────────────────
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json({ addresses: user.addresses });
});

// ═════════════════════════════════════════════
// ADMIN CONTROLLERS
// ═════════════════════════════════════════════

// @desc    Get all users  |  GET /api/users  |  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Get user by ID  |  GET /api/users/:id  |  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user  |  PUT /api/users/:id  |  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, isAdmin: updated.isAdmin });
});

// @desc    Delete user  |  DELETE /api/users/:id  |  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted successfully' });
});

module.exports = {
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
};
