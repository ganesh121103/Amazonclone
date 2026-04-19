const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// ─────────────────────────────────────────────
// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
// ─────────────────────────────────────────────
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'cartItems.product',
    'name images price countInStock'
  );

  if (!cart) {
    cart = { cartItems: [], totalPrice: 0 };
  }

  res.json(cart);
});

// ─────────────────────────────────────────────
// @desc    Add item to cart (or update qty if exists)
// @route   POST /api/cart
// @access  Private
// ─────────────────────────────────────────────
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.countInStock < qty) {
    res.status(400);
    throw new Error(`Only ${product.countInStock} items available`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart for user
    cart = new Cart({
      user: req.user._id,
      cartItems: [
        {
          product: product._id,
          name: product.name,
          image: product.images[0]?.url,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        },
      ],
    });
  } else {
    const existingItem = cart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.qty = qty; // Update quantity
    } else {
      // Add new item
      cart.cartItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      });
    }
  }

  await cart.save();
  res.json(cart);
});

// ─────────────────────────────────────────────
// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
// ─────────────────────────────────────────────
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
});

// ─────────────────────────────────────────────
// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
// ─────────────────────────────────────────────
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.cartItems = [];
    await cart.save();
  }

  res.json({ message: 'Cart cleared successfully' });
});

module.exports = { getCart, addToCart, removeFromCart, clearCart };
