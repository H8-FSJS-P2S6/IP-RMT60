import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  login,
  googleLogin,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectIsAdmin,
  clearAuthError
} from "../store/slices/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const googleButtonRef = useRef(null);
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Redirect authenticated users away from login page
    if (isAuthenticated) {
      const targetPath = isAdmin ? "/admin/dashboard" : "/";
      if (location.pathname === "/login") {
        navigate(targetPath, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location.pathname]);

  useEffect(() => {
    // Clear any previous errors when mounting component
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // Prevent navigation if we're already at the target location
      const from = location.state?.from?.pathname || (isAdmin ? "/admin/dashboard" : "/");
      const currentPath = location.pathname;
      
      if (currentPath !== from) {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleCredentialResponse = useCallback((response) => {
    if (response.credential) {
      dispatch(googleLogin({ id_token: response.credential }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Cleanup previous google sign-in if exists
    const cleanup = () => {
      const googleScript = document.querySelector('script[src*="accounts.google.com/gsi"]');
      if (googleScript) {
        googleScript.remove();
      }
    };

    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { 
            theme: "outline", 
            size: "large", 
            width: 320, // Use fixed width instead of percentage
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'center'
          }
        );
      }
    };

    // Add script only if it doesn't exist
    if (!window.google) {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initializeGoogleSignIn();
    }

    return cleanup;
  }, [handleCredentialResponse]);

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

              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-3 text-muted">or</span>
                <hr className="flex-grow-1" />
              </div>

              <div 
                ref={googleButtonRef} 
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '40px' }}
              ></div>

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
