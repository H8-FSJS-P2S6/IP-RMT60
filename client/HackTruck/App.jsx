// App.jsx (ensure this is correct)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './store/store';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="713517391777-3sfb91kna4sibldihbrngjgflp2d0djd.apps.googleusercontent.com">
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DriverDashboard />} />
          </Routes>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;