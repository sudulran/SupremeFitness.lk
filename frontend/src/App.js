import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Page imports
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductManagement from './pages/ProductManagement';
import PurchaseHistory from './pages/PurchaseHistory';
import SalesHistory from './pages/SalesHistory';
import TrainerManagement from './pages/TrainerManagement';
import TimeSlotManagement from './pages/TimeSlotManagement';
import Appointments from './pages/Appointments';
import Reviews from './pages/Reviews';
import AppointmentManagement from './pages/AppointmentManagement';
import MyAppointments from './pages/MyAppointments';
import AdminReviews from './pages/AdminReviews';
import CreateWorkoutPlan from './pages/CreateWorkoutPlan';
import CreateMealPlan from './pages/CreateMealPlan';
import HomePage from './pages/HomePage';
import WorkoutPlansOverview from './pages/WorkoutPlansOverview';
import MealPlansOverview from './pages/MealPlansOverview';

const AppRoutes = () => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    setIsAuthenticated(!!token);
    setUserRole(user?.role || null);
    setLoading(false);
  }, [location]);

  const getPostAuthRoute = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'user') return '/';
    return '/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={getPostAuthRoute()} /> : <Login />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to={getPostAuthRoute()} /> : <Register />
          }
        />

        {/* Admin only */}
        <Route
          path="/admin-dashboard"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* User dashboard (optional) */}
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

        {/* Purchase History - User only */}
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

        {/* Sales History - Admin only */}
        <Route
          path="/admin-sale-summary"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <SalesHistory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Trainer Management - Admin only */}
        <Route
          path="/admin-trainer-management"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <TrainerManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Trainer - Time Slots Management - Admin only */}
        <Route
          path="/admin-timeslot-management/:trainerId"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <TimeSlotManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* User Appointments */}
        <Route
          path="/user-appointments"
          element={
            isAuthenticated && userRole === 'user' ? (
              <Appointments />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/user-rate-management/:username/:trainerId"
          element={
            isAuthenticated && userRole === 'user' ? (
              <Reviews />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin-appointment-management"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AppointmentManagement />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/user-my-appointments"
          element={
            isAuthenticated && userRole === 'user' ? (
              <MyAppointments />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin-reviews"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <AdminReviews />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/workout-plans"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <WorkoutPlansOverview />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/meal-plans"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <MealPlansOverview />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/workout-plans/create"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <CreateWorkoutPlan />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/meal-plans/create"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <CreateMealPlan />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
