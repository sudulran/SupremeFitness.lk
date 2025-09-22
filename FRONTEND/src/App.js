import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import StoreAdminDashboard from "./pages/StoreAdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProductManagement from "./pages/ProductManagement";
import AdminTrainerManagement from "./pages/AdminTrainerManagement";
import TrainerBrowse from "./pages/TrainerBrowse";

const AppRoutes = () => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setIsAuthenticated(!!token);
    setUserRole(user?.role || null);
    setLoading(false);
  }, [location]);

  const getDashboardRoute = () => {
    if (userRole === "admin") return "/admin-dashboard";
    if (userRole === "user") return "/user-dashboard";
    return "/login";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Default redirect */}
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

        {/* Auth routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Register />}
        />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && userRole === "admin" ? (
              <StoreAdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-product-management"
          element={
            isAuthenticated && userRole === "admin" ? (
              <ProductManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-trainer-management"
          element={
            isAuthenticated && userRole === "admin" ? (
              <AdminTrainerManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* User routes */}
        <Route
          path="/user-dashboard"
          element={
            isAuthenticated && userRole === "user" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/trainers"
          element={
            isAuthenticated && userRole === "user" ? (
              <TrainerBrowse />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
