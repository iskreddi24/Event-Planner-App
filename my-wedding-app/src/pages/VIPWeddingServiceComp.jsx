import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { io } from "socket.io-client";
import "../styles/VIPWeddingService.css";

import {
  FaHeart,
  FaMapMarkerAlt,
  FaCommentDots,
  FaArrowRight,
  FaUserFriends,
  FaRegClock,
} from "react-icons/fa";
import { GiBigDiamondRing } from "react-icons/gi";

// ✅ Socket connection
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});

const VIPWeddingServiceComp = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [actions, setActions] = useState([]);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [bookings, setBookings] = useState([]); // 🆕 User bookings
  const [functionHalls, setFunctionHalls] = useState({
    Hyderabad: [],
    Mumbai: [],
    Delhi: [],
  });

  const [formData, setFormData] = useState({
    weddingDate: "",
    guestCount: 300,
    totalBudget: 500000,
    decorationTheme: "Standard Decor",
    haldiTeam: false,
  });

  const defaultHalls = {
    Hyderabad: [
      { name: "The Grand Regal", capacity: 1500, price: "₹4 Lakh" },
      { name: "Taj Falaknuma Palace", capacity: 500, price: "₹15 Lakh" },
      { name: "Pragati Resorts", capacity: 2000, price: "₹3 Lakh" },
    ],
    Mumbai: [
      { name: "The St. Regis", capacity: 700, price: "₹10 Lakh" },
      { name: "Blue Sea Banquets", capacity: 1200, price: "₹5 Lakh" },
      { name: "ITC Grand Central", capacity: 800, price: "₹8 Lakh" },
    ],
    Delhi: [
      { name: "The Leela Palace", capacity: 600, price: "₹12 Lakh" },
      { name: "Vivanta Dwarka", capacity: 1000, price: "₹4.5 Lakh" },
      { name: "Ambience Golf Drive", capacity: 1800, price: "₹6 Lakh" },
    ],
  };

  const vipServices = [
    { icon: GiBigDiamondRing, name: "Wedz Assistance", desc: "A dedicated team to guide your entire wedding plan." },
    { icon: FaUserFriends, name: "Wedz Makeup", desc: "Professional bridal makeup and styling services." },
    { icon: FaCommentDots, name: "Wedz Invitation", desc: "Create and share digital invites with guests easily." },
    { icon: FaMapMarkerAlt, name: "Wedz Venue", desc: "Exclusive venue curation at best prices." },
    { icon: FaHeart, name: "Wedz Photography", desc: "Capture every moment with our premium photography." },
  ];

  const planningSteps = [
    { title: "SEARCH", desc: "Find the best vendors and venues for your wedding." },
    { title: "SELECT", desc: "Compare quotes and finalize your perfect team." },
    { title: "BOOK", desc: "Book, pay securely, and relax — we’ll handle the rest." },
  ];

  // ✅ Notification function
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // auto-hide after 5s
  };

  // Fetch VIP halls
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axiosClient.get("/vip/management/halls");
        const halls = res.data || [];
        if (halls.length === 0) return setFunctionHalls(defaultHalls);

        const grouped = halls.reduce((acc, hall) => {
          if (!acc[hall.city]) acc[hall.city] = [];
          acc[hall.city].push(hall);
          return acc;
        }, {});
        setFunctionHalls(grouped);
      } catch (error) {
        console.error("Error fetching halls:", error);
        setFunctionHalls(defaultHalls);
      }
    };
    fetchHalls();
  }, []);

  // Fetch user bookings
  const fetchBookings = async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const res = await axiosClient.get(`/vip/bookings/${user.id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching VIP bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, user]);

  // Socket events
  useEffect(() => {
    socket.on("vipHallAdded", (newHall) => {
      setFunctionHalls((prev) => {
        const updated = { ...prev };
        if (!updated[newHall.city]) updated[newHall.city] = [];
        updated[newHall.city].push(newHall);
        return updated;
      });
    });

    socket.on("vipChatUpdate", (msg) => setChat((prev) => [...prev, msg]));

    return () => {
      socket.off("vipHallAdded");
      socket.off("vipChatUpdate");
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVenueBook = async (hallName) => {
    if (!isAuthenticated) return navigate("/login");
    if (!formData.weddingDate)
      return showNotification("⚠️ Please select a valid wedding date first!", "error");

    const bookingData = {
      weddingDate: formData.weddingDate,
      city: selectedCity,
      selectedVenue: { name: hallName },
      guestCount: parseInt(formData.guestCount, 10),
      totalBudget: parseFloat(formData.totalBudget),
      requiredServices: {
        decorationTheme: formData.decorationTheme,
        haldiTeam: formData.haldiTeam,
      },
    };

    try {
      const res = await axiosClient.post("/vip/book", bookingData);
      if (res.data.success) {
        showNotification(`✅ Booking confirmed for ${hallName}!`, "success");
        fetchBookings();
      } else {
        showNotification(`❌ Booking failed for ${hallName}`, "error");
      }
    } catch (err) {
      console.error("Error booking venue:", err);
      showNotification("❌ Something went wrong while booking!", "error");
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = {
      sender: user?.name || "User",
      text: message,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("vipChatMessage", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
  };

  if (!isAuthenticated)
    return (
      <div className="vip-login-prompt">
        <h2>Login to access VIP Services</h2>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );

  return (
    <div className="vip-service-comp">
      {/* 🔔 Floating Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "25px",
            backgroundColor:
              notification.type === "success"
                ? "#2ecc71"
                : notification.type === "error"
                ? "#e74c3c"
                : "#3498db",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontWeight: "600",
            zIndex: 1000,
          }}
        >
          {notification.message}
        </div>
      )}

      {/* HERO SECTION */}
      <div className="vip-hero">
        <div className="hero-content">
          <h1 className="vip-title">
            Your One-Stop Shop for <span className="highlight">VIP Wedding Planning</span>
          </h1>
          <p className="vip-tagline">
            Plan your dream wedding with our dedicated experts.
          </p>
          <button
            className="start-planning-btn"
            onClick={() => showNotification("🎉 Planning started!", "success")}
          >
            Start Planning <FaArrowRight />
          </button>
        </div>
      </div>

      {/* PROCESS */}
      <section className="vip-section planning-section">
        <h2 className="section-title">The VIP Wedding Process</h2>
        <div className="steps-container">
          {planningSteps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-icon">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="vip-section services-section">
        <h2 className="section-title">Shaadi Baraati Inhouse Services</h2>
        <div className="services-grid">
          {vipServices.map((service, index) => (
            <div className="service-card" key={index}>
              <service.icon className="service-icon" />
              <h4>{service.name}</h4>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="vip-section booking-form-section">
        <h2 className="section-title">Step 1: Specify Your Wedding Details</h2>
        <div className="booking-form-card">
          <label>Wedding Date*</label>
          <input
            type="date"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleFormChange}
            required
          />
          <label>Guest Count*</label>
          <input
            type="number"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleFormChange}
            min="50"
            required
          />
          <label>Total Budget (₹)*</label>
          <input
            type="number"
            name="totalBudget"
            value={formData.totalBudget}
            onChange={handleFormChange}
            required
          />
          <label>Decoration Theme</label>
          <input
            type="text"
            name="decorationTheme"
            value={formData.decorationTheme}
            onChange={handleFormChange}
            placeholder="e.g., Grand Floral, Royal Peacock"
          />
          <div className="haldi-checkbox">
            <input
              type="checkbox"
              name="haldiTeam"
              checked={formData.haldiTeam}
              onChange={handleFormChange}
              id="haldi-check"
            />
            <label htmlFor="haldi-check">Require Haldi Team?</label>
          </div>
        </div>
      </section>

      {/* VENUE BOOKING */}
      <section className="vip-section venue-section">
        <h2 className="section-title">Step 2: Choose Your Exclusive Venue</h2>
        <div className="city-selector">
          {Object.keys(functionHalls).map((city) => (
            <button
              key={city}
              className={`city-btn ${selectedCity === city ? "active" : ""}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
        <div className="venue-grid">
          {functionHalls[selectedCity]?.map((hall, index) => (
            <div className="venue-card" key={index}>
              <h5>{hall.name}</h5>
              <p>Capacity: {hall.capacity}</p>
              <p>Price: {hall.price}</p>
              <button
                className="venue-book-btn"
                onClick={() => handleVenueBook(hall.name)}
                disabled={!formData.weddingDate}
              >
                Book / Enquire
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🧾 VIP BOOKINGS LIST */}
  {/* 🧾 VIP BOOKINGS LIST (Stylish Version) */}
<section className="vip-section vip-bookings-section">
  <h2 className="section-title">💍 Your VIP Bookings</h2>

  {bookings.length === 0 ? (
    <p className="no-bookings-text">You haven’t booked any VIP venues yet.</p>
  ) : (
    <div className="vip-booking-cards">
      {bookings.map((b) => (
        <div key={b._id} className="vip-booking-card">
          <div className="card-header">
            <h3>{b.selectedVenue?.name || "Venue Unknown"}</h3>
            <span
              className={`status-badge ${
                b.status?.toLowerCase() || "pending"
              }`}
            >
              {b.status || "Pending"}
            </span>
          </div>

          <div className="card-body">
            <p>
              <strong>📅 Date:</strong>{" "}
              {new Date(b.weddingDate).toLocaleDateString()}
            </p>
            <p>
              <strong>📍 City:</strong> {b.city}
            </p>
            <p>
              <strong>👥 Guests:</strong> {b.guestCount || 0}
            </p>
            <p>
              <strong>💰 Budget:</strong> ₹
              {b.totalBudget?.toLocaleString() || "N/A"}
            </p>

            {b.requiredServices && (
              <>
                <p>
                  <strong>🎨 Theme:</strong>{" "}
                  {b.requiredServices.decorationTheme || "Standard"}
                </p>
                {b.requiredServices.haldiTeam && (
                  <p>
                    <strong>🌼 Haldi Team:</strong> Included
                  </p>
                )}
              </>
            )}
          </div>

          <div className="card-footer">
            <small>
              Booked on:{" "}
              {new Date(b.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </small>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

    </div>
  );
};

export default VIPWeddingServiceComp;
