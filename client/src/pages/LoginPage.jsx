import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const navigate = useNavigate();
  const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerSubmit = async () => {
    try {
      const data = await axios.post(serverUrl + "/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      Swal.fire({
        title: "Login successfully",
        icon: "success",
        draggable: true,
      });
      console.log(data, "<<< data");
      localStorage.setItem("access_token", data.data.access_token);

      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        const decoded = jwtDecode(access_token);
        console.log(decoded, "<<< decoded");
        localStorage.setItem(
          "auth",
          JSON.stringify({
            roles: decoded.roles,
          })
        );
      }

      navigate("/");
    } catch (error) {
      Swal.fire({
        title: error.response?.data?.message || error.message,
        icon: "error",
      });
      console.log(error);
    }
  };

  async function handleCredentialResponse(response) {
    try {
      console.log("Encoded JWT ID token: " + response.credential);
      console.log("before post");
      const { data } = await axios.post(serverUrl + "/login/google", {
        googleToken: response.credential,
      });
      console.log("after post");

      console.log(data, "<<< data acc token");

      localStorage.setItem("access_token", data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: googleClientID,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }
    );
    window.google.accounts.id.prompt();
  }, []);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Login</h3>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                handlerSubmit(e);
              }}
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={(e) => onChange("password", e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-2">
              <span>Don't have an account? </span>
              <Link to={"/register"}>Register</Link>
            </div>
            <div className="text-center mt-2">
              <div id="buttonDiv"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
