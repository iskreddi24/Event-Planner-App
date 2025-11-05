import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import "../styles/Auth.css";
import Toast from "../components/common/Toast";
import { useToast } from "../hooks/useToast";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("⚠️ Please fill in both email and password.", "error");
      return;
    }

    try {
      const { data } = await axiosClient.post("/auth/login", formData);

      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        login(data.user, data.token);

        showToast(" Login successful!", "success");

        setTimeout(() => {
          if (data.user.role === "admin") navigate("/admin");
          else navigate("/dashboard");
        }, 800);
      } else {
        showToast("Invalid server response.", "error");
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errMsg =
        error.response?.data?.message || "An error occurred during login.";
      showToast(` ${errMsg}`, "error");
    }
  };

  return (
    <div className="auth-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <h1 className="auth-title">Login to Your Account</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-btn">
          Login
        </button>

        <div className="auth-links">
          <Link to="/" className="quick-link">
             Back to Home
          </Link>
          <Link to="/signup" className="quick-link">
            Create New Account
          </Link>
        </div>

        <p className="auth-link-text owner-switch-link">
          Are you a <strong>Function Hall Owner</strong>?{" "}
          <Link to="/hall-owner-login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
