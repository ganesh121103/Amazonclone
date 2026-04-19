require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const mockRoutes = require('./routes/mockRoutes');

const startServer = async () => {
  const app = express();

  // ─── Middleware ───────────────────────────────
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ─── Health Check ─────────────────────────────
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Amazon Clone API is running', timestamp: new Date() });
  });

  // Connect to MongoDB
  const isConnected = await connectDB();

  if (isConnected) {
    // ─── Real API Routes ───────────────────────────────
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/payment', paymentRoutes);
  } else {
    // ─── Mock API Routes ───────────────────────────────
    app.use('/api', mockRoutes);
  }

  // ─── Static files in Production ───────────────
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    );
  }

  // ─── Error Handling Middleware (must be last) ──
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    if (!isConnected) {
      console.log(`⚠️  WARNING: Running in MOCK MODE due to database connection failure.`);
    }
  });
};

startServer();
