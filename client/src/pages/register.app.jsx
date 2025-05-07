import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData
      );
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data.message || "Registration failed. Please try again."
        );
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MY PHONES - Register</title>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n       body {\n           margin: 0;\n           padding: 0;\n           font-family: Arial, sans-serif;\n           background-color: #121212;\n           color: white;\n           display: flex;\n           justify-content: center;\n           align-items: center;\n           height: 100vh;\n       }\n       \n       .brand-name {\n           font-size: 24px;\n           font-weight: bold;\n           text-align: center;\n           margin-bottom: 10px;\n       }\n       \n       .my {\n           color: white;\n       }\n       \n       .phones {\n           color: #00BFFF;\n       }\n       \n       .login-container {\n           width: 400px;\n           background-color: #1E1E1E;\n           border-radius: 10px;\n           padding: 30px;\n           box-shadow: 0 0 10px rgba(0,0,0,0.5);\n       }\n       \n       .login-container h2 {\n           text-align: center;\n           margin-bottom: 30px;\n           color: white;\n       }\n       \n       .form-group {\n           margin-bottom: 20px;\n       }\n       \n       .form-group label {\n           display: block;\n           margin-bottom: 8px;\n           color: white;\n       }\n       \n       .form-group input {\n           width: 100%;\n           padding: 10px;\n           border-radius: 5px;\n           border: 1px solid #333;\n           background-color: #2A2A2A;\n           color: white;\n           box-sizing: border-box;\n       }\n       \n       .login-btn {\n           width: 100%;\n           padding: 12px;\n           background: linear-gradient(to right, #E91E63, #9C27B0);\n           color: white;\n           border: none;\n           border-radius: 5px;\n           cursor: pointer;\n           font-weight: bold;\n           transition: opacity 0.3s;\n       }\n       \n       .login-btn:hover {\n           opacity: 0.9;\n       }\n       \n       .login-text {\n           text-align: center;\n           margin-top: 15px;\n           font-size: 14px;\n           color: #ccc;\n       }\n       \n       .login-text a {\n           color: #00BFFF;\n           text-decoration: none;\n           font-weight: bold;\n       }\n       \n       .error {\n           color: #ff4444;\n           text-align: center;\n           margin-bottom: 15px;\n       }\n       \n       .success {\n           color: #00ff00;\n           text-align: center;\n           margin-bottom: 15px;\n       }\n   ",
        }}
      />
      <div className="login-container">
        <div className="brand-name">
          <span className="my">MY</span> <span className="phones">PHONES</span>
        </div>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
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
            Register
          </button>
        </form>
        <div className="login-text">
          Do you have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </>
  );
}
