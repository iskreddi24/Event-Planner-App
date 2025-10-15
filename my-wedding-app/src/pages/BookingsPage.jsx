import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import "../styles/BookingsPage.css";
import { useLocation } from "react-router-dom";

function BookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        console.log('User object:', user); 
        console.log('User ID:', user?.id); 
        if (user?.id) {
            const fetchBookings = async () => {
                setLoading(true);
                setFetchError(null);

                try {
                    const res = await axiosClient.get("/contact/my-bookings");
                    setBookings(res.data);
                } catch (err) {
                    console.error("Error fetching bookings:", err);
                    const status = err.response?.status;

                    if (status === 401) {
                        setFetchError("Authentication failed. Please log in again.");
                    } else if (status === 403) {
                        setFetchError("Access denied.");
                    } else if (status === 404) {
                        setFetchError("No bookings found for this user.");
                    } else {
                        setFetchError("Failed to load your bookings. Server error or network issue.");
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchBookings();
        } else {
            setLoading(false);
        }
    }, [user, location.state?.bookingSubmitted]);

    const handleCancel = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) return;

        try {
            await axiosClient.delete(`/contact/${bookingId}`);
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            alert("Booking cancelled successfully.");
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert("Failed to cancel booking. Check server logs.");
        }
    };

    if (loading) return <p>Loading your bookings...</p>;
    if (!user) return <p>Please log in to view your bookings.</p>;
    if (fetchError) return <p className="error-message">{fetchError}</p>;

    return (
        <div className="bookings-page">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul className="bookings-list">
                    {bookings.map((booking) => (
                        <li key={booking._id} className="booking-card">
                            <h3>{booking.eventType}</h3>
                            <p><strong>Name:</strong> {booking.name}</p>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Message:</strong> {booking.message}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </p>
                            <small>
                                Submitted on: {new Date(booking.submittedAt).toLocaleDateString()}
                            </small>
                            <div className="booking-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => handleCancel(booking._id)}
                                >
                                    Cancel Booking
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default BookingsPage;
