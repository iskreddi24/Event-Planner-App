
import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
};

function AdminDashboard() {
    const { user } = useAuth();
    console.log("AdminDashboard component HAS MOUNTED.");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAdmin = user?.role === "admin";

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosClient.get("/contact");
            setBookings(res.data);
        } catch (err) {
            console.error("Error fetching all bookings:", err);
            const message = err.response?.data?.message || (err.message.includes('403') || err.message.includes('401') ?
                "Access Failed: Ensure you are logged in as admin and the server is running." :
                "Failed to load inquiries. Server might be down or no response.");
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []); 
    useEffect(() => {
        if (!isAdmin) {
            setError("Access Denied: Not authenticated as admin.");
            setLoading(false);
            return;
        }
        fetchBookings();
    }, [isAdmin, fetchBookings]); 

    const updateStatus = async (bookingId, newStatus) => {
        try {
            await axiosClient.put(`/contact/${bookingId}/status`, { status: newStatus });

            setBookings(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
            );
        } catch (err) {
            console.error("Error updating status:", err);
            alert(`Failed to update status to ${newStatus}. Please check backend logs.`);
            fetchBookings();
        }
    };

    if (!isAdmin) {
        return <p className="admin-error">Access Denied. Admins only.</p>;
    }

    if (loading) return <p className="text-blue-500">Loading Admin Portal Data...</p>;
    if (error) return <p className="admin-error">{error}</p>;
    console.log("AdminDashboard useEffect running. Attempting fetch...");

    return (
        <div className="admin-dashboard">
            <h1>Admin Portal: Customer Inquiries ({bookings.length})</h1>
            {bookings.length === 0 ? (
                <p>No customer inquiries have been submitted yet.</p>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => {
                        const { _id, name, email, phone, eventType, eventDate, eventLocation, profession, message, submittedAt, status = "Pending" } = booking;

                        const statusClass = status.toLowerCase();

                        return (
                            <div key={_id} className="admin-card">
                                <h3>{eventType || "General Inquiry"}</h3>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`status-badge ${statusClass}`}>{status}</span>
                                </p>
                                {}
                                <p><strong>Name:</strong> {name}</p>
                                <p><strong>Email:</strong> {email}</p>
                                <p><strong>Phone:</strong> {phone || 'N/A'}</p>
                                <p><strong>Event Date:</strong> {formatDate(eventDate)}</p>
                                <p><strong>Location:</strong> {eventLocation || 'N/A'}</p>
                                <p><strong>Profession:</strong> {profession || 'N/A'}</p>
                                <p><strong>Message:</strong> {message}</p>
                                <small>Submitted: {formatDate(submittedAt)}</small>

                                {}
                                <div className="admin-actions">
                                    {status !== "Contacted" && (
                                        <button className="accept-btn" onClick={() => updateStatus(_id, "Contacted")}>
                                            Contacted
                                        </button>
                                    )}
                                    {status !== "Completed" && (
                                        <button className="complete-btn" onClick={() => updateStatus(_id, "Completed")}>
                                            Complete
                                        </button>
                                    )}
                                    {status !== "Pending" && (
                                        <button className="pending-btn" onClick={() => updateStatus(_id, "Pending")}>
                                            Reset Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;