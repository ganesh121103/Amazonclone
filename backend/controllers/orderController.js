const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// ─────────────────────────────────────────────
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// ─────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items found');
  }

  // Verify stock availability for all items
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.name} not found`);
    }
    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.countInStock} left.`);
    }
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  // Decrement stock for each ordered item
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.qty },
    });
  }

  res.status(201).json(createdOrder);
});

// ─────────────────────────────────────────────
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// ─────────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow only the order owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// ─────────────────────────────────────────────
// @desc    Update order to paid (after Stripe success)
// @route   PUT /api/orders/:id/pay
// @access  Private
// ─────────────────────────────────────────────
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };
  order.orderStatus = 'Processing';

  const updated = await order.save();
  res.json(updated);
});

// ─────────────────────────────────────────────
// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
// ─────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// ═════════════════════════════════════════════
// ADMIN CONTROLLERS
// ═════════════════════════════════════════════

// @desc    Get all orders  |  GET /api/orders  |  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status  |  PUT /api/orders/:id/status  |  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(req.body.status)) {
    res.status(400);
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (req.body.status === 'Cancelled') {
    // Restore stock on cancellation
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.qty },
      });
    }
  }

  const updated = await order.save();
  res.json(updated);
});

// @desc    Get dashboard stats  |  GET /api/orders/stats  |  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = (await require('../models/userModel').countDocuments()) ;
  const totalProducts = await require('../models/productModel').countDocuments();

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  // Monthly revenue for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Recent orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue,
    monthlyRevenue,
    recentOrders,
  });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
