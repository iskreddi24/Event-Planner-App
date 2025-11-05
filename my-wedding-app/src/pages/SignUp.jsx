import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import "../styles/Auth.css";
import Toast from "../components/common/Toast";
import { useToast } from "../hooks/useToast";

function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast("⚠️ Please fill all fields before submitting!", "error");
      return;
    }

    try {
      const { data } = await axiosClient.post("/auth/register", formData);

      if (data?.token && data?.user) {
        showToast("Registration successful! Redirecting to login...", "success");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        showToast("Invalid server response.", "error");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      showToast(
        error.response?.data?.message || "An error occurred during registration.",
        "error"
      );
    }
  };

  return (
    <div className="auth-page">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <h1 className="auth-title">Create Your Account</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          Sign Up
        </button>

        <div className="auth-links">
          <Link to="/" className="quick-link">
            Back to Home
          </Link>
          <Link to="/login" className="quick-link">
            Back to Login
          </Link>
        </div>

        <div className="owner-register-section">
          <p>--- OR ---</p>
          <Link to="/hall-owner-signup" className="auth-btn owner-register-btn">
            Register as Hall Owner
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
