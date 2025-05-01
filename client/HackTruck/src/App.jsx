import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadScript } from '@react-google-maps/api';
import { store } from '../store/store';
import Navbar from '../components/Navbar.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import DriverDashboard from '../pages/DriverDashboard.jsx';
import Profile from '../pages/Profile.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

// Use environment variable or fallback to the existing ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "713517391777-3sfb91kna4sibldihbrngjgflp2d0djd.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <Provider store={store}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Router>
        </Provider>
      </LoadScript>
    </GoogleOAuthProvider>
  );
}

export default App;