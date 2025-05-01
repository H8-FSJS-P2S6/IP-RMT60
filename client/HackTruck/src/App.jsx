// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from "../store/store";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../store/slices/authSlice';
import Navbar from '../components/Navbar.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import DriverDashboard from '../pages/DriverDashboard.jsx';
import Profile from '../pages/Profile.jsx'; // Import komponen Profile
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';

// NavbarWrapper component to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  
  // Don't render Navbar on login or register pages
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }
  
  return <Navbar />;
};

// Main layout component
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'auto'
  };
  
  return (
    <div style={layoutStyle} className={isAuthPage ? 'auth-page' : 'main-app'}>
      {children}
    </div>
  );
};

// Authentication checker component
const AuthChecker = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check for existing auth token on app startup
    dispatch(checkAuth());
  }, [dispatch]);
  
  return (
    <AppLayout>
      <NavbarWrapper />
      <Routes>
        {/* Redirect from home to driver dashboard */}
        <Route path="/" element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="713517391777-3sfb91kna4sibldihbrngjgflp2d0djd.apps.googleusercontent.com">
      <Provider store={store}>
        <Router>
          <AuthChecker />
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;