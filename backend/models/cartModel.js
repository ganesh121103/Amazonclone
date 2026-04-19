const mongoose = require('mongoose');

// Cart item sub-schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    cartItems: [cartItemSchema],
  },
  { timestamps: true }
);

// Virtual field: total cart price
cartSchema.virtual('totalPrice').get(function () {
  return this.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
