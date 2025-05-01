// App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store'; // Updated import path
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import Profile from './pages/Profile.jsx'; // Import halaman Profile
import 'bootstrap/dist/css/bootstrap.min.css';

// Komponen untuk menangani navbar yang bersyarat
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);
  
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* Rute baru untuk Profile */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="713517391777-3sfb91kna4sibldihbrngjgflp2d0djd.apps.googleusercontent.com">
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;