import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ModernAdminLayout from "./layouts/ModernAdminLayout";

// Regular Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentResult from "./pages/PaymentResult";

// Modern Admin Pages
import ModernDashboard from "./pages/Admin/ModernDashboard";
import ModernUsers from "./pages/Admin/ModernUsers";
import ModernCourses from "./pages/Admin/ModernCourses";
import ModernCategories from "./pages/Admin/ModernCategories";
import ModernTransactions from "./pages/Admin/ModernTransactions";
import ModernPayments from "./pages/Admin/ModernPayments";

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Jika masih loading, tampilkan loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />) : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />) : <Register />
      } />

      {/* Admin routes */}
      <Route path="/admin/*" element={
        isAuthenticated ? (isAdmin ? <ModernAdminLayout /> : <Navigate to="/" />) : <Navigate to="/login" />
      }>
        <Route path="dashboard" element={<ModernDashboard />} />
        <Route path="users" element={<ModernUsers />} />
        <Route path="courses" element={<ModernCourses />} />
        <Route path="categories" element={<ModernCategories />} />
        <Route path="transactions" element={<ModernTransactions />} />
        <Route path="payments" element={<ModernPayments />} />
      </Route>

      {/* Regular user routes - redirect admin to admin dashboard */}
      <Route path="/*" element={
        isAdmin ? <Navigate to="/admin/dashboard" /> : <MainLayout />
      }>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:id" element={<CategoryDetail />} />
        
        {/* Protected user routes */}
        <Route element={isAuthenticated ? <Outlet /> : <Navigate to="/login" />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Payment Result Routes */}
      <Route path="/payment/success" element={<PaymentResult />} />
      <Route path="/payment/failed" element={<PaymentResult />} />
      <Route path="/payment/pending" element={<PaymentResult />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}
