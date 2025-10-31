import React, { useState } from "react";
import axiosClient from "../utils/axiosClient";
import "../styles/QueryChatbot.css";

const QueryChatbot = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState(null); // New state for client-side errors

  if (!user || !user._id || !user.name) {
    return null; 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setFormError(null);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setFormError("Message cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await axiosClient.post("/queries", {
        userId: user._id,
        name: user.name,
        message: trimmedMessage, 
      });
      setSuccess("Query submitted successfully!");
      setMessage("");
    } catch (err) {
      console.error("Error submitting query:", err.response?.data?.error || err.message);
      setFormError(err.response?.data?.error || "Failed to submit query. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${open ? "open" : ""}`}>
      {open ? (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Ask a Question (Logged in as: {user.name})</span>
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="chatbot-form">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
            />
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? "Submitting..." : "Send"}
            </button>
          </form>
          {formError && <p className="chatbot-error">{formError}</p>}
          {success && <p className="chatbot-success">{success}</p>}
        </div>
      ) : (
        <button className="chatbot-toggle-btn" onClick={() => setOpen(true)}>
          💬 Ask a Question
        </button>
      )}
    </div>
  );
};

export default QueryChatbot;