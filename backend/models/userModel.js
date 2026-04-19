const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Disabled for simple usernames
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minLength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password in queries by default
    },
    avatar: {
      public_id: { type: String, default: '' },
      url: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1/sample_avatar',
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Shipping addresses saved by the user
    addresses: [
      {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        state: String,
        country: { type: String, default: 'India' },
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    // Wishlist - array of product IDs
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
