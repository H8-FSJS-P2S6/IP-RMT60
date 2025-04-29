import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData
      );

      login(
        {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.access_token
      );

      // Redirect berdasarkan role
      if (response.data.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  async function handleCredentialResponse(response) {
    try {
      console.log("Encoded JWT ID token: " + response.credential);

      const { data } = await axios.post(
        "http://localhost:3000/api/users/login/google",
        { id_token: response.credential }
      );

      // Gunakan fungsi googleLogin dari AuthContext
      googleLogin(data);

      // Redirect berdasarkan role
      if (data.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.response?.data?.message || "Google login failed");
    }
  }

  useEffect(() => {
    // Pastikan window.google tersedia
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // Pastikan elemen buttonDiv sudah ada di DOM
      const buttonDiv = document.getElementById("buttonDiv");
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large",
        });
        window.google.accounts.id.prompt();
      }
    } else {
      console.error("Google API belum tersedia");
    }
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none">
              <h1 className="text-primary fw-bold">SNS NDT Learning</h1>
            </Link>
          </div>

          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="d-flex justify-content-center mt-4">
                <div id="buttonDiv"></div>
              </div>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary fw-bold">
                    Register
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
