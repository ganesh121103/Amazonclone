const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// ─────────────────────────────────────────────
// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
// ─────────────────────────────────────────────
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PRODUCTS_PER_PAGE) || 12;
  const page = Number(req.query.page) || 1;

  // Build query object
  const query = {};

  // Keyword search (uses text index)
  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // Category filter
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Minimum rating filter
  if (req.query.rating) {
    query.rating = { $gte: Number(req.query.rating) };
  }

  // Featured only
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }

  // Sort option
  let sortOption = { createdAt: -1 }; // newest first by default
  if (req.query.sort === 'price_asc') sortOption = { price: 1 };
  if (req.query.sort === 'price_desc') sortOption = { price: -1 };
  if (req.query.sort === 'rating') sortOption = { rating: -1 };
  if (req.query.sort === 'popular') sortOption = { numReviews: -1 };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('user', 'name');

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// ─────────────────────────────────────────────
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
// ─────────────────────────────────────────────
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('user', 'name')
    .populate('reviews.user', 'name avatar');

  if (product) {
    // Basic recommendations: same category, exclude current product
    const recommendations = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(6)
      .select('name images price rating numReviews');

    res.json({ product, recommendations });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// ─────────────────────────────────────────────
// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
// ─────────────────────────────────────────────
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar?.url,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added successfully' });
});

// ─────────────────────────────────────────────
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
// ─────────────────────────────────────────────
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(8).select('name images price rating numReviews');
  res.json(products);
});

// ═════════════════════════════════════════════
// ADMIN CONTROLLERS
// ═════════════════════════════════════════════

// @desc    Create product  |  POST /api/products  |  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, images, brand, category, description,
    price, originalPrice, countInStock, isFeatured, tags,
  } = req.body;

  const product = new Product({
    user: req.user._id,
    name,
    images: images || [
      { public_id: 'placeholder', url: 'https://via.placeholder.com/400x400?text=Product+Image' },
    ],
    brand,
    category,
    description,
    price,
    originalPrice: originalPrice || price,
    countInStock,
    isFeatured: isFeatured || false,
    tags: tags || [],
  });

  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update product  |  PUT /api/products/:id  |  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = [
    'name', 'images', 'brand', 'category', 'description',
    'price', 'originalPrice', 'countInStock', 'isFeatured', 'tags',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product  |  DELETE /api/products/:id  |  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
});

// @desc    Get all products (admin, no pagination limit)
// @route   GET /api/products/admin  |  Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).populate('user', 'name');
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
};
