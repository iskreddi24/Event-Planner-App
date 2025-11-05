import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import axiosClient from "../utils/axiosClient";
import Toast from "../components/common/Toast";
import { useToast } from "../hooks/useToast";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("⚠️ Please enter your email address.", "error");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Step 1: Ask backend to create reset token
      const { data } = await axiosClient.post("/auth/forgot-password", { email });

      // 🔥 Step 2: Prepare reset link for the user
      const resetLink = `${import.meta.env.VITE_FRONTEND_URL}/reset-password/${data.token}`;

      // 🔥 Step 3: Send email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_name: data.name,      // 👈 must match {{to_name}} in template
          to_email: email,         // 👈 must match {{to_email}}
          reset_link: resetLink,   // 👈 must match {{reset_link}}
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      showToast("📧 Password reset link sent successfully!", "success");
      setEmail("");

    } catch (err) {
      console.error("Forgot Password Error:", err);
      const msg =
        err.text ||
        err.response?.data?.message ||
        "❌ Failed to send reset email. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <h1 className="auth-title">Forgot Password?</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="muted" style={{ textAlign: "center", marginBottom: "10px" }}>
          Enter your registered email to receive a password reset link.
        </p>

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
