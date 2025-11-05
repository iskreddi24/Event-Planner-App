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

// ✅ Connect to backend socket server
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
  const [functionHalls, setFunctionHalls] = useState({
    Hyderabad: [],
    Mumbai: [],
    Delhi: [],
  });

  // 🆕 NEW FORM STATE
  const [formData, setFormData] = useState({
    weddingDate: "",
    guestCount: 300,
    totalBudget: 500000,
    decorationTheme: "Standard Decor", // for requiredServices.decorationTheme
    haldiTeam: false, // for requiredServices.haldiTeam
  });

  // Default backup venues
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
    {
      icon: GiBigDiamondRing,
      name: "Wedz Assistance",
      desc: "A dedicated team to guide your entire wedding plan.",
      link: "#",
    },
    {
      icon: FaUserFriends,
      name: "Wedz Makeup",
      desc: "Professional bridal makeup and styling services.",
      link: "#",
    },
    {
      icon: FaCommentDots,
      name: "Wedz Invitation",
      desc: "Create and share digital invites with guests easily.",
      link: "#",
    },
    {
      icon: FaMapMarkerAlt,
      name: "Wedz Venue",
      desc: "Exclusive venue curation at best prices.",
      link: "#",
    },
    {
      icon: FaHeart,
      name: "Wedz Photography",
      desc: "Capture every moment with our premium photography.",
      link: "#",
    },
  ];

  const planningSteps = [
    {
      title: "SEARCH",
      desc: "Find the best vendors and venues for your wedding.",
    },
    {
      title: "SELECT",
      desc: "Compare quotes and finalize your perfect team.",
    },
    {
      title: "BOOK",
      desc: "Book, pay securely, and relax — we’ll handle the rest.",
    },
  ];

  // 🎯 Fetch halls (from backend or fallback)
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axiosClient.get("/vip/management/halls");
        const halls = res.data || [];
        if (halls.length === 0) {
          setFunctionHalls(defaultHalls);
          return;
        }

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

  // ⚡ Real-time updates
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

  // 📋 Log user actions
  const logAction = (message, type = "info", actionName = "Action") => {
    const newAction = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      message,
      type,
      actionName,
    };
    setActions((prev) => [newAction, ...prev]);
  };

  // 🆕 Handle form input change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVenueBook = async (hallName) => {
    if (!isAuthenticated) {
      return navigate("/login");
    }
    
    if (!formData.weddingDate) {
      alert("Please select a valid wedding date in Step 1 first!");
      return;
    }

    if (formData.guestCount < 50) {
      alert("Guest count must be at least 50 for a VIP request.");
      return;
    }

    const bookingData = {
      weddingDate: formData.weddingDate,
      city: selectedCity,
      selectedVenue: { name: hallName }, // Venue name from button click
      guestCount: parseInt(formData.guestCount, 10),
      totalBudget: parseFloat(formData.totalBudget),
      // Pass the new services fields from form state
      requiredServices: { 
        decorationTheme: formData.decorationTheme, 
        haldiTeam: formData.haldiTeam 
      },
    };

    try {
      const res = await axiosClient.post("/vip/book", bookingData);
      if (res.data.success) {
        logAction(`VIP Request submitted for ${hallName}`, "success", "Venue Booking");
        socket.emit("vipBookingAdded", res.data.booking);
        // 🚀 Optional: Reset date/venue after successful booking to prevent accidental duplicate clicks
        setFormData(prev => ({...prev, weddingDate: ""}));
      } else {
        logAction(`VIP Request failed for ${hallName}`, "error", "Venue Booking");
      }
    } catch (err) {
      console.error("Error booking venue:", err);
      logAction(`Error submitting VIP Request for ${hallName}`, "error", "Venue Booking");
    }
  };

  // 💬 Chat (User ↔ Admin)
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
      {/* HERO */}
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
            onClick={() => logAction("VIP planning started", "success", "Start Planning")}
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
              <a href={service.link} className="read-more-link">
                Read More <FaArrowRight />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 🆕 VENUE BOOKING FORM SECTION */}
      <section className="vip-section booking-form-section">
        <h2 className="section-title">Step 1: Specify Your Wedding Details</h2>
        <div className="booking-form-card">
          <label htmlFor="weddingDate">Wedding Date*</label>
          <input 
            type="date" 
            name="weddingDate" 
            id="weddingDate"
            value={formData.weddingDate} 
            onChange={handleFormChange} 
            required 
          />

          <label htmlFor="guestCount">Approximate Guest Count*</label>
          <input 
            type="number" 
            name="guestCount" 
            id="guestCount"
            value={formData.guestCount} 
            onChange={handleFormChange} 
            min="50"
            required 
          />
          
          <label htmlFor="totalBudget">Total Budget (INR)*</label>
          <input 
            type="number" 
            name="totalBudget" 
            id="totalBudget"
            value={formData.totalBudget} 
            onChange={handleFormChange} 
            min="100000"
            required 
          />
          
          <label htmlFor="decorationTheme">Decoration Theme</label>
          <input 
            type="text" 
            name="decorationTheme" 
            id="decorationTheme"
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
            <label htmlFor="haldi-check">Require Haldi Team/Services?</label>
          </div>
        </div>
        <p className="form-tip">
          <FaArrowRight /> Fill the details above, then choose a venue below to submit your VIP request.
        </p>
      </section>

      {/* VENUES */}
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
          {functionHalls[selectedCity]?.length > 0 ? (
            functionHalls[selectedCity].map((hall, index) => (
              <div className="venue-card" key={index}>
                <div className="venue-detail">
                  <h5>{hall.name}</h5>
                  <p>Capacity: {hall.capacity}</p>
                  <p>
                    VIP Price:{" "}
                    <strong>{hall.price || `₹${hall.vipPrice?.toLocaleString()}`}</strong>
                  </p>
                </div>
                <button
                  className="venue-book-btn"
                  onClick={() => handleVenueBook(hall.name)}
                  // 🛑 DISABLED if date is missing
                  disabled={!formData.weddingDate} 
                  title={!formData.weddingDate ? "Please enter the wedding date first (Step 1)" : `Book ${hall.name}`}
                >
                  Book / Enquire
                </button>
              </div>
            ))
          ) : (
            <p className="no-venues">No venues found for {selectedCity}.</p>
          )}
        </div>
      </section>

      {/* CHAT */}
      <section className="vip-section contact-expert">
        <h2>
          <FaCommentDots /> VIP Live Chat
        </h2>
        <div className="chat-box">
          {chat.map((msg, idx) => (
            <p key={idx}>
              <b>{msg.sender}:</b> {msg.text}
            </p>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </section>

      {/* ACTION LOG */}
      <section className="vip-section action-log-section">
        <h2 className="section-title">
          <FaRegClock /> Your VIP Action Log
        </h2>
        <div className="action-log-container">
          {actions.length === 0 ? (
            <p className="no-actions">
              No recent actions. Start planning your dream wedding!
            </p>
          ) : (
            actions.map((action) => (
              <div key={action.id} className={`action-item ${action.type}`}>
                <div className="action-header">
                  <span className="action-name">{action.actionName}</span>
                  <span className="action-time">{action.time}</span>
                </div>
                <p className="action-message">{action.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default VIPWeddingServiceComp;