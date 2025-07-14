import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import TechnicalLayout from "./layouts/TechnicalLayout";
import AuthLayout from "./layouts/AuthLayout";
import ModernAdminLayout from "./layouts/ModernAdminLayout";

// Technical User Pages
import TechnicalHome from "./pages/TechnicalHome";
import TechnicalCourses from "./pages/TechnicalCourses";
import TechnicalCourseDetail from "./pages/TechnicalCourseDetail";
import TechnicalCategories from "./pages/TechnicalCategories";
import TechnicalProfile from "./pages/TechnicalProfile";
import ModernLogin from "./pages/ModernLogin";
import ModernRegister from "./pages/ModernRegister";

// Legacy Pages (to be updated)
import ModernCourseLearning from "./pages/ModernCourseLearning";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentResult from "./pages/PaymentResult";

// Modern Admin Pages
import ModernDashboard from "./pages/Admin/ModernDashboard";
import ModernAdminUsers from "./pages/Admin/ModernUsers";
import ModernAdminCourses from "./pages/Admin/ModernCourses";
import ModernAdminCategories from "./pages/Admin/ModernCategories";
import ModernTransactions from "./pages/Admin/ModernTransactions";
import ModernPayments from "./pages/Admin/ModernPayments";
import ChatbotManagement from "./pages/Admin/ChatbotManagement";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Loading spinner with modern design
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={
        isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />) : <ModernLogin />
      } />
      <Route path="/register" element={
        isAuthenticated ? (isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />) : <ModernRegister />
      } />

      {/* Admin routes */}
      <Route path="/admin/*" element={
        isAuthenticated ? (isAdmin ? <ModernAdminLayout /> : <Navigate to="/" />) : <Navigate to="/login" />
      }>
        <Route path="dashboard" element={<ModernDashboard />} />
        <Route path="users" element={<ModernAdminUsers />} />
        <Route path="courses" element={<ModernAdminCourses />} />
        <Route path="categories" element={<ModernAdminCategories />} />
        <Route path="transactions" element={<ModernTransactions />} />
        <Route path="payments" element={<ModernPayments />} />
        <Route path="chatbot" element={<ChatbotManagement />} />
      </Route>

      {/* User routes - redirect admin to admin dashboard */}
      <Route path="/*" element={
        isAdmin ? <Navigate to="/admin/dashboard" /> : <TechnicalLayout />
      }>
        <Route index element={<TechnicalHome />} />
        <Route path="courses" element={<TechnicalCourses />} />
        <Route path="courses/:id" element={<TechnicalCourseDetail />} />
        <Route path="courses/:id/learn" element={<ModernCourseLearning />} />
        <Route path="categories" element={<TechnicalCategories />} />
        <Route path="categories/:id" element={<TechnicalCourses />} />
        
        {/* Protected user routes */}
        <Route element={isAuthenticated ? <Outlet /> : <Navigate to="/login" />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<TechnicalProfile />} />
          <Route path="learn/:id" element={<ModernCourseLearning />} />
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
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  );
}
