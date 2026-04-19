import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protects routes that require authentication
export const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

// Protects routes that require admin role
export const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
