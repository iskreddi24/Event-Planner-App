import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleViewBookings = () => {
        if (!isAuthenticated) {
            alert("Please log in to view your bookings.");
            navigate("/login");
            return;
        }
        navigate("/bookings");
    };
    const handleExclusiveOffers = () => {
        navigate("/exclusive-offers");
    };


    return (
        <div className="dashboard-page">
            <div className="welcome-card">
                <h1 className="welcome-title">
                    Welcome back, {user ? user.name : "Guest"}!
                </h1>
                <p className="welcome-message">
                    We're glad to see you. Manage your bookings and explore our latest offers below.
                </p>
                <div className="dashboard-features">
                    <button className="feature-btn" onClick={handleViewBookings}>
                        My Bookings
                    </button>
                    <button className="feature-btn" onClick={handleExclusiveOffers}>
                        Exclusive Offers
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
