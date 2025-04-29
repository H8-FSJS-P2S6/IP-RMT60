import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect jika pengguna sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:3000/api/users/register", formData);
      
      // Redirect ke halaman login setelah berhasil register
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please login with your new account." 
        }
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || 
        "Registration failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none">
              <h1 className="text-primary fw-bold">SNS NDT Learning</h1>
            </Link>
          </div>
          
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-primary">Create an Account</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  <div className="form-text">We'll never share your email with anyone else.</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    minLength="6"
                  />
                  <div className="form-text">Password must be at least 6 characters</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number (optional)"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter your address (optional)"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-bold">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}