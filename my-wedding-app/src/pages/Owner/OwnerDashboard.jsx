// // src/components/owner/OwnerDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import "../../styles/dashboardDa.css"; // Assuming you have a style file

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// export default function OwnerDashboard() {
//     const { user, token } = useAuth();
//     const [hallDetails, setHallDetails] = useState(null);
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [isEditing, setIsEditing] = useState(false);
//     const [editFormData, setEditFormData] = useState({});

//     useEffect(() => {
//         if (!user || user.role !== 'hallOwner') {
//             setError('Access Denied. Please log in as a Hall Owner.');
//             setLoading(false);
//             return;
//         }

//         const ownerId = user._id; // Assuming user contains the owner's ID

//         const fetchData = async () => {
//             try {
//                 // 1. Fetch Hall Details (The hall associated with the owner)
//                 // 💡 ASSUMPTION: New API endpoint to fetch hall by owner ID
//                 const hallRes = await axios.get(`${API_URL}/owner/hall/${ownerId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setHallDetails(hallRes.data);
//                 setEditFormData(hallRes.data); // Initialize edit form data

//                 // 2. Fetch Confirmed Bookings for this Hall
//                 // 💡 ASSUMPTION: New API endpoint to fetch confirmed bookings for a specific hall
//                 const bookingsRes = await axios.get(`${API_URL}/owner/bookings/${hallRes.data._id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 // Ensure backend only returns bookings where paymentStatus: 'Completed'
//                 setBookings(bookingsRes.data);

//             } catch (err) {
//                 console.error("Error fetching dashboard data:", err);
//                 setError(`Failed to fetch data: ${err.response?.data?.message || 'Server error'}`);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [user, token]);


//     // Handler for updating hall details
//     const handleUpdateChange = (e) => {
//         setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         try {
//             // 💡 ASSUMPTION: API endpoint to update hall details
//             const res = await axios.put(`${API_URL}/owner/hall/${hallDetails._id}`, editFormData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setHallDetails(res.data); // Update displayed details
//             setIsEditing(false); // Exit edit mode
//             alert('Hall details updated successfully!');
//         } catch (err) {
//             setError(`Update failed: ${err.response?.data?.message || 'Server error'}`);
//         }
//     };

//     if (loading) return <div className="owner-dashboard-container">Loading Dashboard...</div>;
//     if (error) return <div className="owner-dashboard-container error">{error}</div>;
//     if (!hallDetails) return <div className="owner-dashboard-container">No Hall associated with this owner account.</div>;

//     // Helper to format date and time
//     const formatBooking = (booking) => {
//         const date = new Date(booking.date);
//         return {
//             date: date.toLocaleDateString(),
//             time: booking.timeSlot,
//             eventType: booking.eventType,
//             amount: booking.totalAmount.toLocaleString('en-IN')
//         };
//     };

//     return (
//         <div className="owner-dashboard-container">
//             <h2 className="dashboard-title">Welcome, {user.name} 👋</h2>

//             {/* Hall Details Section */}
//             <div className="dashboard-card hall-details-card">
//                 <h3 className="card-title">{hallDetails.hallName} Details</h3>
//                 {!isEditing ? (
//                     <>
//                         <p><strong>Location:</strong> {hallDetails.location} - {hallDetails.area}</p>
//                         <p><strong>Capacity:</strong> {hallDetails.capacity} Guests</p>
//                         <p><strong>Price Per Day:</strong> ₹{hallDetails.pricePerDay.toLocaleString('en-IN')}</p>
//                         <p><strong>Email:</strong> {user.email}</p>
//                         <button className="edit-button" onClick={() => setIsEditing(true)}>Modify Details</button>
//                     </>
//                 ) : (
//                     <form onSubmit={handleUpdateSubmit} className="edit-form">
//                         <input type="text" name="hallName" value={editFormData.hallName || ''} onChange={handleUpdateChange} placeholder="Hall Name" required />
//                         <input type="number" name="capacity" value={editFormData.capacity || ''} onChange={handleUpdateChange} placeholder="Capacity" required />
//                         <input type="number" name="pricePerDay" value={editFormData.pricePerDay || ''} onChange={handleUpdateChange} placeholder="Price (INR)" required />
//                         {/* Note: Location/Area changes might require more complex logic on the backend */}
//                         <input type="text" name="location" value={editFormData.location || ''} onChange={handleUpdateChange} placeholder="State/City" required />
//                         <input type="text" name="area" value={editFormData.area || ''} onChange={handleUpdateChange} placeholder="Area/Sub-District" required />

//                         <div className="form-actions">
//                             <button type="submit" className="save-button">Save Changes</button>
//                             <button type="button" className="cancel-button" onClick={() => { setIsEditing(false); setEditFormData(hallDetails); }}>Cancel</button>
//                         </div>
//                     </form>
//                 )}
//             </div>

//             {/* Confirmed Bookings Section */}
//             <div className="dashboard-card bookings-card">
//                 <h3 className="card-title">Confirmed Bookings</h3>
//                 {bookings.length === 0 ? (
//                     <p>No confirmed bookings yet.</p>
//                 ) : (
//                     <ul className="booking-list">
//                         {bookings.map(booking => {
//                             const details = formatBooking(booking);
//                             return (
//                                 <li key={booking._id} className="booking-item">
//                                     <div className="booking-info">
//                                         <strong>{details.eventType}</strong> on {details.date}
//                                     </div>
//                                     <div className="booking-slot">
//                                         {details.time} | Amount: ₹{details.amount}
//                                     </div>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// }
// src/pages/Owner/OwnerDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Make sure this path is correct
import "../../styles/dashboardDa.css"; // Ensure this CSS file exists

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function OwnerDashboard() {
    // 1. Get user/token from context
    const { user, token } = useAuth();

    const [hallDetails, setHallDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        // Essential check: Redirect if not an owner (or not logged in)
        if (!user || user.role !== 'hallOwner') {
            setError('Access Denied. Please log in as a Hall Owner.');
            setLoading(false);
            return;
        }

        const ownerId = user._id;

        const fetchData = async () => {
            try {
                // 1. Fetch Hall Details (The hall associated with the owner)
                // 💡 ASSUMPTION: Backend route GET /owner/hall/:ownerId
                // const hallRes = await axios.get(`${API_URL}/owner/hall/${ownerId}`, {
                //     headers: { Authorization: `Bearer ${token}` }
                // });
                // OwnerDashboard.jsx fetches:

                // 1. Fetch Hall Details by Owner ID (CAUSING 404)
                const hallRes = await axios.get(`${API_URL}/owner/hall/${ownerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const hall = hallRes.data; // Now we have the hall ID: hall._id





                setHallDetails(hall);
                setEditFormData(hall); // Initialize edit form data

                // 2. Fetch Confirmed Bookings for this Hall
                // 💡 ASSUMPTION: Backend route GET /owner/bookings/:hallId
                // Backend MUST filter results for status: 'Confirmed'
                const bookingsRes = await axios.get(`${API_URL}/owner/bookings/${hall._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(bookingsRes.data);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(`Failed to fetch data: ${err.response?.data?.message || 'Server error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, token]); // Re-run if user/token changes


    // Handler for updating hall details
    const handleUpdateChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 💡 ASSUMPTION: Backend route PUT /owner/hall/:hallId
            const res = await axios.put(`${API_URL}/owner/hall/${hallDetails._id}`, editFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHallDetails(res.data); // Update displayed details
            setIsEditing(false); // Exit edit mode
            alert('Hall details updated successfully!');
        } catch (err) {
            setError(`Update failed: ${err.response?.data?.message || 'Server error'}`);
        }
    };

    // Helper function to format booking data
    const formatBooking = (booking) => {
        const date = new Date(booking.date);
        return {
            date: date.toLocaleDateString(),
            time: booking.timeSlot,
            eventType: booking.eventType,
            // Assuming totalAmount exists
            amount: booking.totalAmount.toLocaleString('en-IN')
        };
    };


    if (loading) return <div className="owner-dashboard-container">Loading Dashboard...</div>;
    if (error) return <div className="owner-dashboard-container error">{error}</div>;
    // Handle case where an owner is registered but hasn't completed hall setup (shouldn't happen with your signup)
    if (!hallDetails) return <div className="owner-dashboard-container">No Function Hall details found for this account.</div>;

    return (
        <div className="owner-dashboard-container">
            <h2 className="dashboard-title">Welcome, {user.name} 👋</h2>

            {/* Hall Details Section (The data you requested to be displayed) */}
            <div className="dashboard-card hall-details-card">
                <h3 className="card-title">{hallDetails.hallName} Details</h3>
                {!isEditing ? (
                    <>
                        <p><strong>Location:</strong> {hallDetails.location} - {hallDetails.area}</p>
                        <p><strong>Capacity:</strong> {hallDetails.capacity} Guests</p>
                        <p><strong>Price Per Day:</strong> ₹{hallDetails.pricePerDay.toLocaleString('en-IN')}</p>
                        <p><strong>Owner Email:</strong> {user.email}</p>
                        <button className="edit-button" onClick={() => setIsEditing(true)}>Modify Details</button>
                    </>
                ) : (
                    <form onSubmit={handleUpdateSubmit} className="edit-form">
                        <input type="text" name="hallName" value={editFormData.hallName || ''} onChange={handleUpdateChange} placeholder="Hall Name" required />
                        <input type="number" name="capacity" value={editFormData.capacity || ''} onChange={handleUpdateChange} placeholder="Capacity" required />
                        <input type="number" name="pricePerDay" value={editFormData.pricePerDay || ''} onChange={handleUpdateChange} placeholder="Price (INR)" required />
                        {/* Note: Location/Area changes might require complex backend logic */}
                        <input type="text" name="location" value={editFormData.location || ''} onChange={handleUpdateChange} placeholder="State/City" required />
                        <input type="text" name="area" value={editFormData.area || ''} onChange={handleUpdateChange} placeholder="Area/Sub-District" required />

                        <div className="form-actions">
                            <button type="submit" className="save-button">Save Changes</button>
                            <button type="button" className="cancel-button" onClick={() => { setIsEditing(false); setEditFormData(hallDetails); }}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Confirmed Bookings Section (Only confirmed bookings are shown here) */}
            <div className="dashboard-card bookings-card">
                <h3 className="card-title">Confirmed Bookings</h3>
                {bookings.length === 0 ? (
                    <p>No confirmed bookings yet for this hall.</p>
                ) : (
                    <ul className="booking-list">
                        {bookings.map(booking => {
                            const details = formatBooking(booking);
                            return (
                                <li key={booking._id} className="booking-item">
                                    <div className="booking-info">
                                        <strong>{details.eventType}</strong> on {details.date}
                                    </div>
                                    <div className="booking-slot">
                                        {details.time} | Amount: ₹{details.amount}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}