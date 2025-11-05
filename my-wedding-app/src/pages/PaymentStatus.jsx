import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "../styles/PaymentStatus.css";

const socket = io("http://localhost:5000"); // ⚙️ backend socket server (adjust port if needed)

const PaymentStatus = () => {
  const [status, setStatus] = useState("Processing Payment...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // simulate server-side progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("✅ Payment Successful!");
          socket.emit("payment-success", { message: "Payment completed" });
          return 100;
        }
        return prev + 20;
      });
    }, 1000);

    socket.on("server-update", (msg) => {
      console.log("Server:", msg);
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="payment-status-container">
      <h2>💳 Payment Simulation</h2>
      <div className="payment-box">
        <p>{status}</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        {progress >= 100 && (
          <div className="success-message">
            <p>Thank you for your payment!</p>
            <button onClick={() => (window.location.href = "/")}>
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
