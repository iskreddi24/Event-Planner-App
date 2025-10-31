import React, { useEffect, useState, useCallback } from "react";
// FIX: Adjusted relative paths
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css"; // Ensure this path is correct

// FIX: Added try/catch for optional dependencies like react-icons
let FaCamera, FaPalette, FaConciergeBell, FaCommentDots;
try {
    const FaIcons = require("react-icons/fa");
    FaCamera = FaIcons.FaCamera;
    FaPalette = FaIcons.FaPalette;
    FaConciergeBell = FaIcons.FaConciergeBell;
    FaCommentDots = FaIcons.FaCommentDots; // Added for Queries
} catch (e) {
    // Fallback components if react-icons isn't installed
    FaCamera = () => <span role="img" aria-label="camera">📸</span>;
    FaPalette = () => <span role="img" aria-label="palette">🎨</span>;
    FaConciergeBell = () => <span role="img" aria-label="bell">🛎️</span>;
    FaCommentDots = () => <span role="img" aria-label="comment">💬</span>;
}


const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
};

function AdminDashboard() {
    const { user } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const [decorationBookings, setDecorationBookings] = useState([]);
    const [photographyBookings, setPhotographyBookings] = useState([]);
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ⬅️ NEW STATE for Tab Navigation
    const [activeTab, setActiveTab] = useState('inquiries');

    const isAdmin = user?.role === "admin";

    // Reusable function to update status for any service (REMAINS THE SAME)
    const updateStatus = async (bookingId, newStatus, serviceType) => {
        let endpoint = '';
        let setStateFunc = null;

        if (serviceType === 'inquiry') {
            endpoint = `/contact/${bookingId}/status`;
            setStateFunc = setInquiries;
        } else if (serviceType === 'decoration') {
            endpoint = `/decoration/${bookingId}/status`;
            setStateFunc = setDecorationBookings;
        } else if (serviceType === 'photography') {
            endpoint = `/photography/${bookingId}/status`;
            setStateFunc = setPhotographyBookings;
        } else {
            return;
        }

        try {
            await axiosClient.put(endpoint, { status: newStatus });

            setStateFunc(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
            );
        } catch (err) {
            console.error(`Error updating ${serviceType} status:`, err);
            // Re-fetch all data on failure
            fetchInquiries();
            fetchDecorationBookings();
            fetchPhotographyBookings();
        }
    };

    // Fetch functions remain the same (removed the final setLoading(false) from fetchPhotographyBookings
    // and placed it in useEffect for better control)
    
    const fetchInquiries = useCallback(async () => {
        try {
            const res = await axiosClient.get("/contact");
            setInquiries(res.data);
        } catch (err) {
            console.error("Error fetching inquiries:", err);
            setError(err.response?.data?.message || "Failed to load inquiries.");
        }
    }, []);

    const fetchDecorationBookings = useCallback(async () => {
        try {
            const res = await axiosClient.get("/decoration");
            setDecorationBookings(res.data);
        } catch (err) {
            console.error("Error fetching decoration bookings:", err);
        }
    }, []);

    const fetchPhotographyBookings = useCallback(async () => {
        try {
            const res = await axiosClient.get("/photography");
            setPhotographyBookings(res.data);
        } catch (err) {
            console.error("Error fetching photography bookings:", err);
        }
    }, []);

    const fetchQueries = useCallback(async () => {
        try {
            const res = await axiosClient.get("/queries");
            setQueries(res.data);
        } catch (err) {
            console.error("Error fetching chatbot queries:", err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (isAdmin) {
                setLoading(true);
                await Promise.all([
                    fetchInquiries(),
                    fetchDecorationBookings(),
                    fetchPhotographyBookings(),
                    fetchQueries()
                ]);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        loadData();
    }, [isAdmin, fetchInquiries, fetchDecorationBookings, fetchPhotographyBookings, fetchQueries]);


    if (!isAdmin) return <p className="admin-error">Access Denied. Admins only.</p>;
    if (loading) return <p className="text-blue-500">Loading Admin Portal Data...</p>;
    if (error) return <p className="admin-error">{error}</p>;

    // Tab data for easy rendering
    const tabs = [
        { id: 'inquiries', label: `Inquiries (${inquiries.length})`, Icon: FaConciergeBell },
        { id: 'decoration', label: `Decoration (${decorationBookings.length})`, Icon: FaPalette },
        { id: 'photography', label: `Photography (${photographyBookings.length})`, Icon: FaCamera },
        { id: 'queries', label: `Chatbot Queries (${queries.length})`, Icon: FaCommentDots },
    ];

    return (
        <div className="admin-dashboard">
            <h1>Admin Portal Dashboard</h1>

            {/* ⬅️ NEW: Tab Navigation */}
            <nav className="admin-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.Icon /> {tab.label}
                    </button>
                ))}
            </nav>
            
            {/* 1. Customer Inquiries Section (Conditional Rendering) */}
            {activeTab === 'inquiries' && (
                <section className="admin-content-section">
                    <h2>Customer Inquiries</h2>
                    {inquiries.length === 0 ? (
                        <p>No customer inquiries have been submitted yet.</p>
                    ) : (
                        <div className="bookings-grid">
                            {inquiries.map((b) => {
                                const { _id, name, email, phone, eventType, eventDate, eventLocation, profession, message, submittedAt, status = "Pending" } = b;
                                const statusClass = status.toLowerCase();
                                return (
                                    <div key={_id} className="admin-card">
                                        <h3>{eventType || "General Inquiry"}</h3>
                                        <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                        <p><strong>Name:</strong> {name}</p>
                                        <p><strong>Email:</strong> {email}</p>
                                        <p><strong>Phone:</strong> {phone || 'N/A'}</p>
                                        <p><strong>Event Date:</strong> {formatDate(eventDate)}</p>
                                        <p><strong>Location:</strong> {eventLocation || 'N/A'}</p>
                                        <p><strong>Profession:</strong> {profession || 'N/A'}</p>
                                        <p><strong>Message:</strong> {message}</p>
                                        <small>Submitted: {formatDate(submittedAt)}</small>

                                        <div className="admin-actions">
                                            {status !== "Contacted" && (<button className="accept-btn" onClick={() => updateStatus(_id, "Contacted", "inquiry")}>Contacted</button>)}
                                            {status !== "Completed" && (<button className="complete-btn" onClick={() => updateStatus(_id, "Completed", "inquiry")}>Complete</button>)}
                                            {status !== "Pending" && (<button className="pending-btn" onClick={() => updateStatus(_id, "Pending", "inquiry")}>Reset Pending</button>)}
                                            
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* 2. Decoration Bookings Section (Conditional Rendering) */}
            {activeTab === 'decoration' && (
                <section className="admin-content-section">
                    <h2>Decoration Service Bookings</h2>
                    {decorationBookings.length === 0 ? (
                        <p>No decoration bookings have been submitted yet.</p>
                    ) : (
                        <div className="bookings-grid">
                            {decorationBookings.map((b) => {
                                const { _id, userName, eventType, date, location, budget, message, status = "Pending" } = b;
                                const statusClass = status.toLowerCase();
                                return (
                                    <div key={_id} className="admin-card decoration-card">
                                        <h3>{eventType} Decoration</h3>
                                        <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                        <p><strong>Name:</strong> {userName}</p>
                                        <p><strong>Date:</strong> {formatDate(date)}</p>
                                        <p><strong>Location:</strong> {location}</p>
                                        <p><strong>Budget:</strong> ₹{budget || 'N/A'}</p>
                                        <p><strong>Message:</strong> {message}</p>
                                        <div className="admin-actions">
                                            {status !== "Contacted" && (<button className="accept-btn" onClick={() => updateStatus(_id, "Contacted", "decoration")}>Contacted</button>)}
                                            {status !== "Completed" && (<button className="complete-btn" onClick={() => updateStatus(_id, "Completed", "decoration")}>Complete</button>)}
                                            {status !== "Pending" && (<button className="pending-btn" onClick={() => updateStatus(_id, "Pending", "decoration")}>Reset Pending</button>)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* 3. Photoshoot Bookings Section (Conditional Rendering) */}
            {activeTab === 'photography' && (
                <section className="admin-content-section">
                    <h2>Photoshoot Bookings</h2>
                    {photographyBookings.length === 0 ? (
                        <p>No photoshoot bookings have been submitted yet.</p>
                    ) : (
                        <div className="bookings-grid">
                            {photographyBookings.map((b) => {
                                const { _id, userName, eventType, packageType, durationHours, date, location, budget, message, status = "Pending" } = b;
                                const statusClass = status.toLowerCase();
                                return (
                                    <div key={_id} className="admin-card photography-card">
                                        <h3>{eventType} Photoshoot ({packageType})</h3>
                                        <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                        <p><strong>Name:</strong> {userName}</p>
                                        <p><strong>Date:</strong> {formatDate(date)}</p>
                                        <p><strong>Duration:</strong> {durationHours} hours</p>
                                        <p><strong>Location:</strong> {location}</p>
                                        <p><strong>Budget:</strong> ₹{budget || 'N/A'}</p>
                                        <p><strong>Message:</strong> {message}</p>
                                        <div className="admin-actions">
                                            {status !== "Contacted" && (<button className="accept-btn" onClick={() => updateStatus(_id, "Contacted", "photography")}>Contacted</button>)}
                                            {status !== "Completed" && (<button className="complete-btn" onClick={() => updateStatus(_id, "Completed", "photography")}>Complete</button>)}
                                            {status !== "Pending" && (<button className="pending-btn" onClick={() => updateStatus(_id, "Pending", "photography")}>Reset Pending</button>)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* 4. Query Chatbot Submissions Section (Conditional Rendering) */}
            {activeTab === 'queries' && (
                <section className="admin-content-section">
                    <h2>Query Chatbot Submissions</h2>
                    {queries.length === 0 ? (
                        <p>No queries submitted yet.</p>
                    ) : (
                        <div className="bookings-grid">
                            {queries.map((q) => (
                                <div key={q._id} className="admin-card">
                                    <p><strong>User:</strong> {q.name || 'N/A'}</p>
                                    <p><strong>Message:</strong> {q.message}</p>
                                    <small>Submitted: {formatDate(q.createdAt)}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default AdminDashboard;