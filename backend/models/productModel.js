const mongoose = require('mongoose');

// Sub-schema for individual product reviews
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Admin who created the product
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Computers',
        'Smart Home',
        'Arts & Crafts',
        'Automotive',
        'Baby',
        'Beauty',
        'Books',
        'Fashion',
        'Health',
        'Home & Kitchen',
        'Industrial',
        'Luggage',
        'Movies & TV',
        'Music',
        'Pet Supplies',
        'Software',
        'Sports',
        'Toys & Games',
        'Video Games',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0, // Used to show strikethrough / discount
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    // For basic product recommendations — same category
    tags: [{ type: String, lowercase: true }],
  },
  { timestamps: true }
);

// Text index for full-text search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
