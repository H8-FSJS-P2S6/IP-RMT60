import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google'; // Removed useGoogleOAuth
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.log('ErrorBoundary caught:', error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-warning text-center">
          Something went wrong with Google Login. Please use email/password login.
        </div>
      );
    }
    return this.props.children;
  }
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, token } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user && token) {
      navigate('/driver/dashboard');
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    await dispatch(login(formData));
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc, #cfdef3)', // Gradient background
        padding: '2rem',
      }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div
            className="card p-5 shadow-lg"
            style={{
              maxWidth: '700px', // Further increased max width
              width: '100%',
              margin: '0 auto',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              className="text-center mb-5"
              style={{ fontSize: '2.5rem', fontWeight: '700', color: '#333' }}
            >
              Login to HacTruck
            </h2>
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="form-label"
                  style={{ fontSize: '1.3rem', fontWeight: '500', color: '#555' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    height: '55px',
                    fontSize: '1.2rem',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                  }}
                />
              </div>
              <div className="mb-5">
                <label
                  className="form-label"
                  style={{ fontSize: '1.3rem', fontWeight: '500', color: '#555' }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{
                    height: '55px',
                    fontSize: '1.2rem',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
                style={{
                  height: '55px',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  borderRadius: '10px',
                  backgroundColor: '#007bff',
                  borderColor: '#007bff',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-5 text-center">
              <ErrorBoundary>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    console.log('Google Login Credential:', credentialResponse.credential);
                    dispatch(googleLogin(credentialResponse.credential));
                  }}
                  onError={() => {
                    console.log('Google Login Failed');
                  }}
                  style={{
                    width: '100%',
                    fontSize: '1.2rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                  }}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;