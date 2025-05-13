import React, { useState } from "react";
import Joi from "joi";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const schema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
    "string.empty": "name is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "email not valid",
      "any.required": "email is required",
      "string.empty": "email is required",
    }),
  password: Joi.string().min(8).max(64).required().messages({
    "string.min": "password must be 8 - 64 character long",
    "string.max": "password must be 8 - 64 character long",
    "any.required": "password is required",
    "string.empty": "password is required",
  }),
});

const RegisterPage = () => {
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = schema.validate(formData, { abortEarly: false });

    if (error) {
      const formattedErrors = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0]] = detail.message;
      });
      setErrors(formattedErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post(serverUrl + "/register", formData, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        Swal.fire({
          title: "Register successfully",
          icon: "success",
          draggable: true,
        });
        console.log(response);
        navigate("/login");
      } catch (error) {
        Swal.fire({
          title: error.response?.data?.message || error.message,
          icon: "error",
          draggable: true,
        });
        console.log(error);
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to={"/login"}>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
