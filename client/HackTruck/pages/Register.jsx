import { useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-6">
          <div
            className="card p-5 shadow-lg"
            style={{
              maxWidth: '600px', // Increased max width
              width: '100%',
              margin: '0 auto',
              borderRadius: '15px',
              backgroundColor: '#fff',
            }}
          >
            <h2 className="text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Register
            </h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>
                  Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ height: '50px', fontSize: '1.1rem' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ height: '50px', fontSize: '1.1rem' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ height: '50px', fontSize: '1.1rem' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '1.2rem' }}>
                  Role
                </label>
                <select
                  className="form-control form-control-lg"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ height: '50px', fontSize: '1.1rem' }}
                >
                  <option value="user">User</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
                style={{ height: '50px', fontSize: '1.2rem' }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;