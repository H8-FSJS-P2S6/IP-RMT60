import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DriverDashboard from '../pages/DriverDashboard';
import Navbar from '../components/Navbar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
