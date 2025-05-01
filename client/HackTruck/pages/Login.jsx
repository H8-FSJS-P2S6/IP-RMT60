import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
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
        <div
          className="alert alert-warning text-center"
          style={{
            borderRadius: '10px',
            fontSize: '1rem',
            padding: '1rem',
            backgroundColor: '#fef3c7',
            color: '#b45309',
            border: 'none',
          }}
        >
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
    
    // Set the body and html to full height
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Clean up when component unmounts
    return () => {
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
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
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #6b48ff, #00ddeb)',
        overflow: 'auto',
      }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div
            className="card d-flex align-items-center justify-content-center p-4 shadow-lg"
            style={{
              maxWidth: '500px',
              width: '100%',
              margin: '0 auto',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <h2
                className="text-center mb-4"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  color: '#2d2d2d',
                  letterSpacing: '0.5px',
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Welcome to HacTruck
              </h2>
              {error && (
                <div
                  className="alert alert-danger mb-4 text-center"
                  style={{
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    padding: '0.75rem',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    border: 'none',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#4b5563',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Enter your email"
                    style={{
                      height: '45px',
                      fontSize: '1rem',
                      borderRadius: '10px',
                      padding: '0.75rem 1.25rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#6b48ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="form-label"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#4b5563',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                    style={{
                      height: '45px',
                      fontSize: '1rem',
                      borderRadius: '10px',
                      padding: '0.75rem 1.25rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#6b48ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={loading}
                  style={{
                    height: '45px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6b48ff, #00ddeb)',
                    border: 'none',
                    color: '#ffffff',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = '0.9')}
                  onMouseOut={(e) => (e.target.style.opacity = '1')}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>
              <div className="d-flex align-items-center my-4">
                <hr style={{ flex: 1, borderColor: '#d1d5db' }} />
                <span
                  style={{
                    margin: '0 1rem',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  or
                </span>
                <hr style={{ flex: 1, borderColor: '#d1d5db' }} />
              </div>
              <ErrorBoundary>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    console.log('Google Login Credential:', credentialResponse.credential);
                    dispatch(googleLogin(credentialResponse.credential));
                  }}
                  onError={() => {
                    console.log('Google Login Failed');
                  }}
                  text="signin_with"
                  shape="rectangular"
                  width="400"
                  style={{
                    width: '100%',
                    height: '45px',
                    fontSize: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Inter', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              </ErrorBoundary>
              <div
                className="mt-3 text-center"
                style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Don't have an account?{' '}
                <a
                  href="/register"
                  style={{
                    color: '#6b48ff',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;