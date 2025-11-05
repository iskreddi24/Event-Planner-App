// src/components/common/Toast.jsx
import React, { useEffect } from "react";
import "../../styles/Toast.css";

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container ${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
