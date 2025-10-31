
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/exclusiveServices.css";

import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";

function ExclusiveServicesComp() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: user?.name || "", 
        email: user?.email || "",
        phone: user?.phone || "", 
        serviceType: "Makeup Artist",
        dateRequired: "",
        targetPerson: "Bride",
        serviceLocation: "",
        goldWeight: "",
        rentalDurationDays: "",
        budget: "",
        message: ""
    });

    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]); 

    const fetchBookings = async () => {
        if (!isAuthenticated || !user?.id) {
            setBookings([]);
            return;
        }
        try {
            const response = await axiosClient.get(`/exclusive/user/${user.id}`); 
            setBookings(response.data); 
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [isAuthenticated, user]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setStatusMessage("Please log in to submit a service request.");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            const payload = {
                userName: formData.userName || user?.name,
                email: formData.email || user?.email,
                phone: formData.phone, 
                userId: user?.id,
                serviceType: formData.serviceType,
                date: formData.dateRequired,
                location: formData.serviceLocation || "N/A",
                message: formData.message,
                goldWeight: formData.goldWeight || 0,
                rentalDurationDays: formData.rentalDurationDays || 1,
                budget: formData.budget || 0,
            };

            if (formData.serviceType === 'Makeup Artist') {
                payload.targetPerson = formData.targetPerson;
                payload.serviceLocation = formData.serviceLocation;
            }

            await axiosClient.post("/exclusive", payload);
            setStatusMessage("Request submitted successfully! We will contact you shortly.");

            setFormData(prev => ({
                ...prev, dateRequired: '', targetPerson: 'Bride', serviceLocation: '',
                goldWeight: '', rentalDurationDays: '', budget: '', message: ''
            }));

            fetchBookings(); 

        } catch (err) {
            console.error("Submission error:", err);
            const msg = err.response?.data?.message || "Failed to submit request. Check if all required fields are valid.";
            setStatusMessage(`${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const isMakeup = formData.serviceType === 'Makeup Artist';
    const isJewelry = formData.serviceType === 'Jewelry Rental';

    return (
        <div className="exclusive-services-page">
            {}
            <div className="form-card">
                <h1>Exclusive Services</h1>
                <p>Luxury bookings for your special day.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {}
                    <div>
                        <label htmlFor="serviceType">Service Required *</label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Makeup Artist">💄 Makeup Artist (Bride/Groom)</option>
                            <option value="Jewelry Rental">💍 Gold Jewelry Rental</option>
                        </select>
                    </div>

                    {/* Name, Email, Phone, Date */}
                    <div>
                        <label htmlFor="userName">Full Name *</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                        />
                    </div>
                    
                    {/* ⬅️ FIX: Added Phone Number input field */}
                    <div>
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 9876543210"
                        />
                    </div>

                    <div>
                        <label htmlFor="dateRequired">Date Required *</label>
                        <input
                            type="date"
                            id="dateRequired"
                            name="dateRequired"
                            value={formData.dateRequired}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    
                    {isMakeup && (
                        <div className="pink-section">
                            <h4 className="section-title">Makeup Details</h4>
                            <label htmlFor="targetPerson">Target Person</label>
                            <select
                                id="targetPerson"
                                name="targetPerson"
                                value={formData.targetPerson}
                                onChange={handleChange}
                            >
                                <option value="Bride">Bride</option>
                                <option value="Groom">Groom</option>
                                <option value="Other">Other</option>
                            </select>

                            <label htmlFor="serviceLocation">Venue/Location</label>
                            <input
                                type="text"
                                id="serviceLocation"
                                name="serviceLocation"
                                value={formData.serviceLocation}
                                onChange={handleChange}
                                placeholder="Hotel Name or Residence"
                            />
                        </div>
                    )}

                    {isJewelry && (
                        <div className="yellow-section">
                            <h4 className="section-title">Jewelry Rental Details</h4>
                            <label htmlFor="goldWeight">Gold Weight (Grams)</label>
                            <input
                                type="number"
                                id="goldWeight"
                                name="goldWeight"
                                value={formData.goldWeight}
                                onChange={handleChange}
                                min="0"
                            />

                            <label htmlFor="rentalDurationDays">Rental Duration (Days) *</label>
                            <input
                                type="number"
                                id="rentalDurationDays"
                                name="rentalDurationDays"
                                value={formData.rentalDurationDays}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    )}

                    <label htmlFor="budget">Approximate Budget (Optional)</label>
                    <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 50000"
                    />

                    <label htmlFor="message">Additional Details</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>

                    {statusMessage && (
                        <p className={`status-message ${statusMessage.startsWith('✅') ? 'status-success' : 'status-error'}`}>
                            {statusMessage}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : `Book Exclusive Service`}
                    </button>
                </form>
            </div>

            {/* ------------------ Previous Bookings ------------------ */}
            {isAuthenticated && bookings.length > 0 && (
                <div className="previous-bookings">
                    <h2>Your Previous Bookings</h2>
                    {bookings.map((b) => (
                        <div
                            key={b._id}
                            className={`booking-card ${b.serviceType === 'Makeup Artist' ? 'makeup' : 'jewelry'}`}
                        >
                            <h3>{b.serviceType}</h3>
                            <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                            {b.targetPerson && <p><strong>For:</strong> {b.targetPerson}</p>}
                            {b.serviceLocation && <p><strong>Location:</strong> {b.serviceLocation}</p>}
                            {b.goldWeight && <p><strong>Gold Weight:</strong> {b.goldWeight}g</p>}
                            {b.rentalDurationDays && <p><strong>Duration:</strong> {b.rentalDurationDays} days</p>}
                            {b.budget && <p><strong>Budget:</strong> ₹{b.budget}</p>}
                            <p><strong>Status:</strong> <span className={b.status?.toLowerCase() || 'pending'}>
                                {b.status || "Pending"}
                            </span></p>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default ExclusiveServicesComp;