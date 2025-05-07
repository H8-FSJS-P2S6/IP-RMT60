import { Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Handler untuk input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Login normal dengan email dan password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        formData
      );
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("userId", response.data.id);
      Swal.fire({
        title: "Berhasil!",
        text: "Login berhasil",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
        Swal.fire({
          title: "Gagal!",
          text: err.response.data.message || "Login gagal. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setError("Network error. Please check your connection.");
        Swal.fire({
          title: "Error!",
          text: "Network error. Silakan periksa koneksi internet Anda.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Login dengan Google
  async function handleCredentialResponse(response) {
    try {
      const { data } = await axios.post("http://localhost:3000/login/google", {
        googleToken: response.credential,
      });
      localStorage.setItem("access_token", data.access_token);
      Swal.fire({
        title: "Berhasil!",
        text: "Login Google berhasil!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data.message || "Login Google gagal. Silakan coba lagi."
      );
      Swal.fire({
        title: "Gagal!",
        text:
          err.response?.data.message ||
          "Login Google gagal. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  // Fungsi untuk login dengan GitHub
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  // Inisialisasi Google login saat halaman dimuat
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, []);

  // Cek URL untuk parameter code dari GitHub
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    // Cegah eksekusi ganda dengan flag di sessionStorage
    if (code && !sessionStorage.getItem("github_login_processing")) {
      sessionStorage.setItem("github_login_processing", "true");
      const githubLogin = async () => {
        try {
          setError("");
          setSuccess("");
          const response = await axios.post(
            "http://localhost:3000/login/github",
            { code }
          );
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("userId", response.data.id);
          Swal.fire({
            title: "Berhasil!",
            text: "Login GitHub berhasil!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            sessionStorage.removeItem("github_login_processing");
            navigate("/");
          });
        } catch (err) {
          console.log(err);
          sessionStorage.removeItem("github_login_processing");
          Swal.fire({
            title: "Gagal!",
            text: "Login GitHub gagal. Silakan coba lagi.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      githubLogin();
    }
  }, [location.search, navigate]);
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MY PHONES - Login</title>
      {/* Link Bootstrap Icons untuk icon GitHub */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n       body {\n           margin: 0;\n           padding: 0;\n           font-family: Arial, sans-serif;\n           background-color: #121212;\n           color: white;\n           display: flex;\n           justify-content: center;\n           align-items: center;\n           height: 100vh;\n       }\n       \n       .brand-name {\n           font-size: 24px;\n           font-weight: bold;\n           text-align: center;\n           margin-bottom: 10px;\n       }\n       \n       .my {\n           color: white;\n       }\n       \n       .phones {\n           color: #00BFFF;\n       }\n       \n       .login-container {\n           width: 400px;\n           background-color: #1E1E1E;\n           border-radius: 10px;\n           padding: 30px;\n           box-shadow: 0 0 10px rgba(0,0,0,0.5);\n       }\n       \n       .login-container h2 {\n           text-align: center;\n           margin-bottom: 30px;\n           color: white;\n       }\n       \n       .form-group {\n           margin-bottom: 20px;\n       }\n       \n       .form-group label {\n           display: block;\n           margin-bottom: 8px;\n           color: white;\n       }\n       \n       .form-group input {\n           width: 100%;\n           padding: 10px;\n           border-radius: 5px;\n           border: 1px solid #333;\n           background-color: #2A2A2A;\n           color: white;\n           box-sizing: border-box;\n       }\n       \n       .login-btn {\n           width: 100%;\n           padding: 12px;\n           background: linear-gradient(to right, #E91E63, #9C27B0);\n           color: white;\n           border: none;\n           border-radius: 5px;\n           cursor: pointer;\n           font-weight: bold;\n           transition: opacity 0.3s;\n       }\n       \n       .login-btn:hover {\n           opacity: 0.9;\n       }\n       \n       .register-text {\n           text-align: center;\n           margin-top: 15px;\n           font-size: 14px;\n           color: #ccc;\n       }\n       \n       .register-text a {\n           color: #00BFFF;\n           text-decoration: none;\n           font-weight: bold;\n       }\n       \n       .error {\n           color: #ff4444;\n           text-align: center;\n           margin-bottom: 15px;\n       }\n       \n       .success {\n           color: #00ff00;\n           text-align: center;\n           margin-bottom: 15px;\n       }\n       \n       .social-login {\n           margin-top: 20px;\n           border-top: 1px solid #333;\n           padding-top: 20px;\n       }\n       \n       .github-btn {\n           background-color: #24292e;\n           color: white;\n           border: none;\n           border-radius: 5px;\n           padding: 10px;\n           width: 100%;\n           margin-top: 10px;\n           cursor: pointer;\n           display: flex;\n           align-items: center;\n           justify-content: center;\n           gap: 10px;\n           font-weight: 500;\n       }\n       \n       .github-btn:hover {\n           background-color: #2c3440;\n       }\n       \n       .or-divider {\n           display: flex;\n           align-items: center;\n           text-align: center;\n           margin: 15px 0;\n           color: #888;\n       }\n       \n       .or-divider::before,\n       .or-divider::after {\n           content: '';\n           flex: 1;\n           border-bottom: 1px solid #444;\n       }\n       \n       .or-divider::before {\n           margin-right: 10px;\n       }\n       \n       .or-divider::after {\n           margin-left: 10px;\n       }\n   ",
        }}
      />
      <div className="login-container">
        <div className="brand-name">
          <span className="my">MY</span> <span className="phones">PHONES</span>
        </div>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="social-login">
          <div className="or-divider">atau</div>

          <div
            className="d-flex justify-content-center mt-3"
            id="buttonDiv"
          ></div>

          <button onClick={handleGitHubLogin} className="github-btn">
            <i className="bi bi-github"></i> Login with GitHub
          </button>
        </div>

        <div className="register-text">
          Don't have an account yet? <Link to="/register">Register</Link>
        </div>
      </div>
    </>
  );
}
