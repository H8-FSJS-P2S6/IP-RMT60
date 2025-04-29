import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// Layout dengan Navbar
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

// Layout tanpa Navbar untuk halaman auth
function AuthLayout({ children }) {
  return <main className="auth-layout">{children}</main>;
}

// Protected Route component untuk mengalihkan pengguna yang sudah login
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  // Debug untuk melihat status autentikasi
  useEffect(() => {
    console.log("Authentication status:", isAuthenticated);
  }, [isAuthenticated]);
  
  return (
    <Routes>
      {/* Halaman dengan Navbar */}
      <Route 
        path="/" 
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        } 
      />
      
      {/* Halaman auth tanpa Navbar dan dengan pengalihan untuk pengguna yang sudah login */}
      <Route 
        path="/login" 
        element={
          <GuestRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </GuestRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <GuestRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </GuestRoute>
        } 
      />
      
      {/* Rute lain (dengan Navbar) */}
      <Route 
        path="/courses" 
        element={
          <MainLayout>
            <h1>Courses Page</h1>
          </MainLayout>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <MainLayout>
            <h1>Categories Page</h1>
          </MainLayout>
        } 
      />
      
      {/* Rute 404 */}
      <Route 
        path="*" 
        element={
          <MainLayout>
            <h1 className="text-center mt-5">Page Not Found</h1>
          </MainLayout>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
