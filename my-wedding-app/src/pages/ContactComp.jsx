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

        const payload = { ...formData, userId: user?.id ?? null };

        try {
            await axiosClient.post("/contact", payload);
            setStatus("success");
            alert("Form submitted successfully! We'll contact you shortly.");
            setFormData(initialFormData);
            navigate("/bookings", { state: { bookingSubmitted: Date.now() } });
        } catch (error) {
            console.error("Submission Error:", error);
            setStatus("error");
            alert("Submission failed. Please try again.");
        }
    };

    return (
        <div className="contact-page">
            <h1 className="page-title">Book Your Dream Event</h1>
            <p className="page-intro">Fill out the form below and let us handle the rest!</p>

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

                {status === "success" && (
                    <p className="status-message success">Thank you! Your inquiry was sent successfully.</p>
                )}
                {status === "error" && (
                    <p className="status-message error">An error occurred. Please try again.</p>
                )}
            </form>
        </div>
    );
}

export default ContactComp;