import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { initTheme } from './slices/themeSlice';

// Layout
import Header from './components/Header';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Private Screens (user)
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';

// Admin Screens
import DashboardScreen from './screens/admin/DashboardScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import UserListScreen from './screens/admin/UserListScreen';

// Inner app component — needs dispatch from provider
const AppInner = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Apply persisted theme on mount
    dispatch(initTheme());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Protected user routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/orders" element={<ProfileScreen />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<DashboardScreen />} />
                <Route path="/admin/products" element={<ProductListScreen />} />
                <Route path="/admin/orders" element={<OrderListScreen />} />
                <Route path="/admin/users" element={<UserListScreen />} />
              </Route>
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={
              <div className="text-center py-24">
                <p className="text-6xl mb-4">404</p>
                <h2 className="text-2xl font-bold dark:text-white mb-3">Page not found</h2>
                <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary inline-block px-8 py-3">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#333', color: '#fff', fontSize: '14px', borderRadius: '8px' },
            success: { iconTheme: { primary: '#FF9900', secondary: '#232F3E' } },
          }}
        />
      </div>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App;
