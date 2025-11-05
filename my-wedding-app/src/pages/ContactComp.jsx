import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import "../styles/Contact.css";

function ContactComp() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const initialFormData = {
        name: "",
        profession: "",
        email: "",
        phone: "",
        eventType: "Wedding",
        message: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [status, setStatus] = useState(null);
    const [notification, setNotification] = useState(null); // 🔔 New state for inline notifications

    useEffect(() => {
        if (user && isAuthenticated) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user, isAuthenticated]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus("loading");
        setNotification({ type: "info", message: "Submitting your inquiry..." });

        const payload = { ...formData, userId: user?._id ?? null };

        try {
            await axiosClient.post("/contact", payload);
            setStatus("success");
            setNotification({ type: "success", message: "✅ Inquiry submitted successfully! We’ll contact you soon." });

            setFormData(initialFormData);

            setTimeout(() => {
                setNotification(null);
                navigate("/bookings", { state: { bookingSubmitted: Date.now() } });
            }, 2000);

        } catch (error) {
            console.error("Submission Error:", error);
            setStatus("error");
            setNotification({ type: "error", message: "❌ Submission failed. Please try again." });
        }
    };

    return (
        <div className="contact-page">
            <h1 className="page-title">Book Your Dream Event</h1>
            <p className="page-intro">Fill out the form below and let us handle the rest!</p>

            {/* ✅ Inline notification box */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
                <label className="form-label">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    required
                    className="form-input"
                />

                <label className="form-label">Profession:</label>
                <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Your Profession"
                    className="form-input"
                />

                <label className="form-label">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="form-input"
                />

                <label className="form-label">Contact Number:</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className="form-input"
                />

                <label className="form-label">Event Type:</label>
                <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="form-select"
                >
                    <option>Wedding</option>
                    <option>Anniversary</option>
                    <option>Half Saree</option>
                    <option>Birthday</option>
                </select>

                <label className="form-label">Message/Details:</label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event..."
                    rows="4"
                    className="form-textarea"
                    required
                ></textarea>

                <button type="submit" className="submit-btn" disabled={status === "loading"}>
                    {status === "loading" ? "Submitting..." : "Submit Inquiry"}
                </button>
            </form>
        </div>
    );
}

export default ContactComp;
