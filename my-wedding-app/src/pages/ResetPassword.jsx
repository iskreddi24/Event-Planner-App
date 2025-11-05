import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import Toast from "../components/common/Toast";
import { useToast } from "../hooks/useToast";
import "../styles/Auth.css";

const ResetPassword = () => {
  const { token } = useParams(); // 👈 Get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast("⚠️ Please fill in both password fields.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("⚠️ Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("❌ Passwords do not match.", "error");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Send new password + token to backend
      const { data } = await axiosClient.post(`/auth/reset-password/${token}`, {
        password,
      });

      showToast("✅ Password reset successfully! Redirecting to login...", "success");

      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("Reset Password Error:", err);
      const msg =
        err.response?.data?.message || "Server error. Please try again later.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="auth-title">Reset Your Password</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="muted" style={{ textAlign: "center", marginBottom: "10px" }}>
          Enter your new password below to reset your account access.
        </p>

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
