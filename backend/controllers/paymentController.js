const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ─────────────────────────────────────────────
// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
// ─────────────────────────────────────────────
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body; // amount in smallest currency unit (paise for INR)

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid payment amount');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'inr',
    metadata: { userId: req.user._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

module.exports = { createPaymentIntent };
