# 🛒 Amazon Clone — Full-Stack MERN E-Commerce

A production-ready Amazon-like e-commerce platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### 1. Clone & Install

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
# In backend/
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/amazonclone    # or MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_here
STRIPE_SECRET_KEY=sk_test_...                       # from stripe.com/dashboard
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...             # from stripe.com/dashboard
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: `admin@amazonclone.com` / `admin123`
- **User**: `rahul@example.com` / `user1234`
- **12 sample products** across all categories

### 4. Run Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Structure

```
Amazonclone/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js       # Auth, profile, wishlist, addresses
│   │   ├── productController.js    # CRUD, search, reviews, recommendations
│   │   ├── orderController.js      # Order lifecycle, stats
│   │   ├── cartController.js       # Persistent cart
│   │   └── paymentController.js    # Stripe payment intents
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect + admin
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   └── cartModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   └── paymentRoutes.js
│   ├── seeder.js                   # DB seed script
│   ├── server.js                   # Entry point
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Rating.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── CheckoutSteps.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminLayout.jsx
│   │   ├── screens/
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ProductScreen.jsx
│   │   │   ├── CartScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── RegisterScreen.jsx
│   │   │   ├── ShippingScreen.jsx
│   │   │   ├── PaymentScreen.jsx
│   │   │   ├── PlaceOrderScreen.jsx
│   │   │   ├── OrderScreen.jsx
│   │   │   ├── ProfileScreen.jsx
│   │   │   └── admin/
│   │   │       ├── DashboardScreen.jsx
│   │   │       ├── ProductListScreen.jsx
│   │   │       ├── OrderListScreen.jsx
│   │   │       └── UserListScreen.jsx
│   │   ├── slices/
│   │   │   ├── apiSlice.js         # RTK Query base
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── themeSlice.js
│   │   │   ├── productsApiSlice.js
│   │   │   ├── usersApiSlice.js
│   │   │   └── ordersApiSlice.js
│   │   ├── store.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
└── README.md
```

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

#### 👤 Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | Public | Register new user |
| POST | `/users/login` | Public | Login & get token |
| GET | `/users/profile` | Private | Get own profile |
| PUT | `/users/profile` | Private | Update profile |
| PUT | `/users/wishlist/:productId` | Private | Toggle wishlist |
| POST | `/users/addresses` | Private | Add address |
| DELETE | `/users/addresses/:id` | Private | Remove address |
| GET | `/users` | Admin | Get all users |
| PUT | `/users/:id` | Admin | Update any user |
| DELETE | `/users/:id` | Admin | Delete user |

#### 📦 Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | Public | List with search/filter/page |
| GET | `/products/:id` | Public | Product detail + recommendations |
| GET | `/products/top` | Public | Top 8 rated products |
| POST | `/products/:id/reviews` | Private | Create product review |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

#### 🛒 Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Private | Get user's cart |
| POST | `/cart` | Private | Add/update item |
| DELETE | `/cart/:productId` | Private | Remove item |
| DELETE | `/cart` | Private | Clear cart |

#### 📋 Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Private | Create order |
| GET | `/orders/myorders` | Private | Get own orders |
| GET | `/orders/:id` | Private | Order by ID |
| PUT | `/orders/:id/pay` | Private | Mark as paid |
| GET | `/orders` | Admin | All orders |
| PUT | `/orders/:id/status` | Admin | Update status |
| GET | `/orders/stats/dashboard` | Admin | Dashboard stats |

#### 💳 Payment
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payment/create-payment-intent` | Private | Create Stripe intent |

---

## 🔐 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@amazonclone.com | admin123 |
| User | rahul@example.com | user1234 |
| User | priya@example.com | user1234 |

---

## 🔧 Features

- ✅ JWT Authentication with bcrypt password hashing
- ✅ Product listing with search, category, price, rating filters + pagination
- ✅ Product reviews & ratings system
- ✅ Persistent cart (MongoDB) + localStorage sync
- ✅ Full checkout flow: shipping → payment → review → place order
- ✅ Stripe payment integration (test mode)
- ✅ Cash on Delivery option
- ✅ Order status lifecycle: Processing → Shipped → Delivered
- ✅ Wishlist management
- ✅ Dark / Light mode
- ✅ Admin dashboard with revenue charts
- ✅ Admin: manage products, orders, users
- ✅ Product recommendations (same category)
- ✅ Toast notifications
- ✅ Fully responsive (mobile-first)
- ✅ RTK Query for caching & state management

---

## 🚢 Deployment

### Render (Backend)
1. Create new **Web Service** on [Render](https://render.com)
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `node server.js`
4. Add all `.env` variables in Render Environment settings
5. Set `NODE_ENV=production`

### Vercel (Frontend)
1. Import frontend folder to [Vercel](https://vercel.com)
2. Set **Framework**: Vite
3. Add env var: `VITE_API_URL=https://your-render-backend.onrender.com/api`
4. Deploy

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running locally or check Atlas URI |
| Port 5000 already in use | Change `PORT` in `backend/.env` |
| Stripe errors | Use `sk_test_` and `pk_test_` keys from Stripe dashboard |
| CORS errors | Ensure `FRONTEND_URL` is set correctly in production |
