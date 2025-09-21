import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import StoreAdminDashboard from './pages/StoreAdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductManagement from './pages/ProductManagement';
import PurchaseHistory from './pages/PurchaseHistory';
import SalesSummary from './pages/SalesHistory';

const AppRoutes = () => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    setIsAuthenticated(!!token);
    setUserRole(user?.role || null);
    setLoading(false); // Only render routes after checking
  }, [location]);

  const getDashboardRoute = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'user') return '/user-dashboard';
    return '/login';
  };

  if (loading) {
    return <div>Loading...</div>; // Prevent routes from rendering during auth check
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute()} />
            ) : (
              <Register />
            )
          }
        />

        {/* Admin only */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <StoreAdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* User only */}
        <Route
          path="/user-dashboard"
          element={
            isAuthenticated && userRole === 'user' ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Product Management - Admin only */}
        <Route
          path="/admin-product-management"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <ProductManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Purchase History Route */}
        <Route
          path="/user-purchase-summary"
          element={
            isAuthenticated && userRole === 'user' ? (
              <PurchaseHistory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Sale History Route */}
        <Route
          path="/admin-sale-summary"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <SalesSummary />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
