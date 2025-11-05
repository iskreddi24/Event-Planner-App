import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";

function PhotographyServiceComp() {
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    userName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    eventType: "",
    packageType: "Standard",
    durationHours: 3,
    date: "",
    location: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(null); // 🔔 Notification State

  const API_URL = "/photography";

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setBookings([]);
      return;
    }

    try {
      const res = await axiosClient.get(`${API_URL}/user/${user.id}`);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching photography bookings:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        showNotification("❌ Your session expired. Please log in again.", "error");
      }
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) setLoading(true);
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔔 Notification Helper (auto-hide after 6s)
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 6000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showNotification("⚠️ Please log in to book a service.", "error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const payload = {
        ...formData,
        userId: user.id,
        userName: formData.userName || user.name,
        email: formData.email || user.email,
        durationHours: Number(formData.durationHours),
        budget: Number(formData.budget) || 0,
      };

      await axiosClient.post(API_URL, payload);

      showNotification(
        `📸 Booking confirmed for your ${formData.eventType || "event"} photoshoot!`,
        "success"
      );

      setFormData({
        userName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        eventType: "",
        packageType: "Standard",
        durationHours: 3,
        date: "",
        location: "",
        budget: "",
        message: "",
      });

      fetchBookings();
    } catch (err) {
      console.error("Error submitting form:", err);
      const msg =
        err.response?.data?.message ||
        "❌ Error submitting booking! Please try again.";
      showNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // 💅 Inline Styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
      padding: "2rem",
      position: "relative",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      width: "420px",
      maxWidth: "90%",
      textAlign: "center",
      marginBottom: "2rem",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#a350a3",
      marginBottom: "10px",
    },
    subText: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "14px",
      transition: "0.3s",
      color: "#333",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "14px",
      minHeight: "100px",
      resize: "none",
    },
    select: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "14px",
      cursor: "pointer",
      color: "#333",
    },
    label: {
      textAlign: "left",
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      marginTop: "10px",
      color: "#555",
    },
    button: {
      backgroundColor: "#a350a3",
      color: "#fff",
      border: "none",
      padding: "12px",
      width: "100%",
      borderRadius: "10px",
      cursor: "pointer",
      marginTop: "15px",
      fontSize: "15px",
      transition: "0.3s",
    },
    statusMessage: {
      marginTop: "15px",
      fontWeight: "600",
    },
    bookingsSection: {
      width: "420px",
      maxWidth: "90%",
    },
    bookingCard: {
      background: "#fff",
      padding: "15px",
      borderRadius: "10px",
      margin: "10px 0",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      textAlign: "left",
    },
    notification: {
      position: "fixed",
      top: "20px",
      right: "25px",
      padding: "12px 18px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 1000,
      animation: "fadeSlideIn 0.4s ease-out",
    },
  };

  return (
    <div style={styles.container}>
      {/* 🔔 Floating Notification */}
      {notification && (
        <div
          style={{
            ...styles.notification,
            backgroundColor:
              notification.type === "success"
                ? "#27ae60"
                : notification.type === "error"
                ? "#e74c3c"
                : "#3498db",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Form Section */}
      <div style={styles.card}>
        <h2 style={styles.heading}>📸 Photoshoot & Photography Booking</h2>
        <p style={styles.subText}>
          Let our professional team capture your special moments.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            style={styles.input}
          />

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select Event Type *</option>
            <option value="Wedding">Wedding/Pre-wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Corporate">Corporate Event</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="Standard">Standard Package</option>
            <option value="Premium">Premium Package</option>
            <option value="Platinum">Platinum (Video + Photo)</option>
          </select>

          <label htmlFor="durationHours" style={styles.label}>
            Approximate Duration (Hours) *
          </label>
          <input
            id="durationHours"
            name="durationHours"
            type="number"
            value={formData.durationHours}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
          />

          <label htmlFor="date" style={styles.label}>
            Date Required *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event Location/Venue"
            required
            style={styles.input}
          />
          <input
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget (Optional)"
            style={styles.input}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Specify special requests..."
            style={styles.textarea}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#8a3c8a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#a350a3")}
          >
            {loading ? "Submitting..." : "Book Photoshoot"}
          </button>
        </form>

        {status && (
          <p
            style={{
              ...styles.statusMessage,
              color: status.startsWith("❌") ? "red" : "green",
            }}
          >
            {status}
          </p>
        )}
      </div>

      {/* 🧾 Previous Bookings */}
      {(isAuthenticated || bookings.length > 0) && (
        <div style={styles.bookingsSection}>
          <h3 style={{ color: "#a350a3", textAlign: "center" }}>
            Previous Photoshoot Bookings
          </h3>
          {loading && <p>Loading your past bookings...</p>}
          {!loading && bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b._id} style={styles.bookingCard}>
                <p>
                  <strong>Event:</strong> {b.eventType} ({b.packageType})
                </p>
                <p>
                  <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Duration:</strong> {b.durationHours} hours
                </p>
                <p>
                  <strong>Location:</strong> {b.location}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        b.status === "Approved"
                          ? "green"
                          : b.status === "Rejected"
                          ? "red"
                          : "#555",
                    }}
                  >
                    {b.status || "Pending"}
                  </span>
                </p>
              </div>
            ))
          ) : (
            !loading &&
            isAuthenticated && (
              <p style={{ textAlign: "center", color: "#666" }}>
                No previous bookings found.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default PhotographyServiceComp;
