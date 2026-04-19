const express = require('express');
const { sampleProducts, users } = require('../data/sampleData');

const router = express.Router();

// Parse products to add _id and calculate pagination
const mockProducts = sampleProducts.map((p, index) => ({
  ...p,
  _id: `mock_prod_${index}`,
  createdAt: new Date().toISOString(),
  reviews: [],
}));

const mockUsers = users.map((u, index) => ({
  ...u,
  _id: `mock_user_${index}`,
}));

// MOCK: Get top products
router.get('/products/top', (req, res) => {
  res.json(mockProducts.slice(0, 8));
});

// MOCK: Get products with search/pagination
router.get('/products', (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : '';
  const category = req.query.category || '';

  let filtered = mockProducts.filter((p) => {
    const matchKeyword = p.name.toLowerCase().includes(keyword);
    const matchCategory = category ? p.category === category : true;
    return matchKeyword && matchCategory;
  });

  const count = filtered.length;
  const products = filtered.slice((page - 1) * pageSize, page * pageSize);

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// MOCK: Get single product
router.get('/products/:id', (req, res) => {
  const product = mockProducts.find((p) => p._id === req.params.id) || mockProducts[0];
  res.json({
    product,
    recommendations: mockProducts.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 6)
  });
});

// MOCK: Auth
router.post('/users/login', (req, res) => {
  const { email } = req.body;
  const user = mockUsers.find((u) => u.email === email) || mockUsers[1];
  res.json({ ...user, token: 'mock_jwt_token' });
});

// MOCK: Profile
router.get('/users/profile', (req, res) => {
  res.json({ ...mockUsers[1], wishlist: [], addresses: [] });
});

// MOCK: Cart
router.get('/cart', (req, res) => {
  res.json({ cartItems: [] });
});

// MOCK: Orders
router.get('/orders/myorders', (req, res) => {
  res.json([]);
});

router.get('/orders/stats/dashboard', (req, res) => {
  res.json({ totalRevenue: 0, totalOrders: 0, totalProducts: 12, totalUsers: 3, monthlyRevenue: [], recentOrders: [] });
});

// Prevent 404s for common POST/PUT mock actions
router.post('/orders', (req, res) => res.json({ _id: 'mock_order_1', ...req.body }));
router.post('/payment/create-payment-intent', (req, res) => res.json({ clientSecret: 'mock_client_secret_xyz' }));
router.post('/users/register', (req, res) => res.json({ ...mockUsers[1], token: 'mockToken' }));

module.exports = router;
