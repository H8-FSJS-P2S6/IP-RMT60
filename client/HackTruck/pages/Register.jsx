import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
    name: '',
  });

  useEffect(() => {
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
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
                Join HacTruck
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
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
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Create a password"
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
                    Role
                  </label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  >
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                  </select>
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
                  {loading ? 'Registering...' : 'Sign Up'}
                </button>
              </form>
              <div
                className="mt-3 text-center"
                style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Already have an account?{' '}
                <a
                  href="/login"
                  style={{
                    color: '#6b48ff',
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;