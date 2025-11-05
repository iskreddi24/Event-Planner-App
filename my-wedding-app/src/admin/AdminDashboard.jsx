// // import React, { useEffect, useState, useCallback } from "react";
// // import axiosClient from "../utils/axiosClient";
// // import { useAuth } from "../context/AuthContext";
// // import "../styles/AdminDashboard.css";
// // import { io } from "socket.io-client";
// // // import { Button } from "@/components/ui/button";

// // // try/catch icons fallback
// // let FaCamera, FaPalette, FaConciergeBell, FaCommentDots, GiBigDiamondRing, FaPlus, FaTrash;
// // try {
// //     const FaIcons = require("react-icons/fa");
// //     FaCamera = FaIcons.FaCamera;
// //     FaPalette = FaIcons.FaPalette;
// //     FaConciergeBell = FaIcons.FaConciergeBell;
// //     FaCommentDots = FaIcons.FaCommentDots;
// //     FaPlus = FaIcons.FaPlus;
// //     FaTrash = FaIcons.FaTrash;
// //     const GiIcons = require("react-icons/gi");
// //     GiBigDiamondRing = GiIcons.GiBigDiamondRing;
// // } catch (e) {
// //     FaCamera = () => <span>📸</span>;
// //     FaPalette = () => <span>🎨</span>;
// //     FaConciergeBell = () => <span>🛎️</span>;
// //     FaCommentDots = () => <span>💬</span>;
// //     GiBigDiamondRing = () => <span>💍</span>;
// //     FaPlus = () => <span>+</span>;
// //     FaTrash = () => <span>🗑️</span>;
// // }

// // const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
// // const socket = io(SOCKET_URL, { autoConnect: true });

// // const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : "N/A");

// // export default function AdminDashboard() {
// //     const { user } = useAuth();
// //     const [inquiries, setInquiries] = useState([]);
// //     const [decorationBookings, setDecorationBookings] = useState([]);
// //     const [photographyBookings, setPhotographyBookings] = useState([]);
// //     const [queries, setQueries] = useState([]); // chat messages (persisted)
// //     const [vipBookings, setVipBookings] = useState([]);
// //     const [vipHalls, setVipHalls] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const [activeTab, setActiveTab] = useState("vip");
// //     const [newHall, setNewHall] = useState({ name: "", city: "Hyderabad", capacity: "", vipPrice: "", amenities: "" });
// //     const hallCities = ["Hyderabad", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata"];

// //     // chat states
// //     const [chat, setChat] = useState([]); // in-memory view (mirrors queries)
// //     const [adminMsg, setAdminMsg] = useState("");

// //     const isAdmin = user?.role === "admin";

// //     // Fetch helpers
// //     const fetchInquiries = useCallback(async () => {
// //         try {
// //             const res = await axiosClient.get("/contact");
// //             setInquiries(res.data);
// //         } catch (err) {
// //             console.error("Error fetching inquiries:", err);
// //             setError(err?.response?.data?.message || "Failed to load inquiries.");
// //         }
// //     }, []);

// //     const fetchDecorationBookings = useCallback(async () => {
// //         try {
// //             const res = await axiosClient.get("/decoration");
// //             setDecorationBookings(res.data);
// //         } catch (err) {
// //             console.error("Error fetching decoration bookings:", err);
// //         }
// //     }, []);

// //     const fetchPhotographyBookings = useCallback(async () => {
// //         try {
// //             const res = await axiosClient.get("/photography");
// //             setPhotographyBookings(res.data);
// //         } catch (err) {
// //             console.error("Error fetching photography bookings:", err);
// //         }
// //     }, []);

// //     const fetchQueries = useCallback(async () => {
// //         try {
// //             // GET /api/queries returns array of chat messages sorted by createdAt asc or desc
// //             const res = await axiosClient.get("/queries");
// //             setQueries(res.data || []);
// //             setChat(res.data || []);
// //         } catch (err) {
// //             console.error("Error fetching queries:", err);
// //         }
// //     }, []);

// //     const fetchVipBookings = useCallback(async () => {
// //         try {
// //             const res = await axiosClient.get("/vip");
// //             setVipBookings(res.data || []);
// //         } catch (err) {
// //             console.error("Error fetching VIP bookings:", err);
// //         }
// //     }, []);

// //     const fetchVipHalls = useCallback(async () => {
// //         try {
// //             const res = await axiosClient.get("/vip/management/halls");
// //             setVipHalls(res.data || []);
// //         } catch (err) {
// //             console.error("Error fetching VIP Halls:", err);
// //         }
// //     }, []);

// //     // Add hall
// //     const handleAddHall = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const hallData = {
// //                 ...newHall,
// //                 capacity: parseInt(newHall.capacity, 10),
// //                 vipPrice: parseFloat(newHall.vipPrice),
// //                 amenities: newHall.amenities ? newHall.amenities.split(",").map(a => a.trim()).filter(Boolean) : []
// //             };
// //             const res = await axiosClient.post("/vip/management/halls", hallData);
// //             const addedHall = res.data?.data || res.data;
// //             socket.emit("vipHallUpdated", { type: "added", hall: addedHall });
// //             setNewHall({ name: "", city: "Hyderabad", capacity: "", vipPrice: "", amenities: "" });
// //             await fetchVipHalls();
// //         } catch (err) {
// //             console.error("Failed to add new VIP hall:", err);
// //             setError(err?.response?.data?.message || "Server error adding hall");
// //         }
// //     };

// //     const handleDeleteHall = async (id) => {
// //         if (!window.confirm("Are you sure you want to delete this VIP Function Hall?")) return;
// //         try {
// //             await axiosClient.delete(`/vip/management/halls/${id}`);
// //             socket.emit("vipHallUpdated", { type: "deleted", hallId: id });
// //             fetchVipHalls();
// //         } catch (err) {
// //             console.error("Failed to delete VIP hall:", err);
// //             setError("Failed to delete hall. Check server logs.");
// //         }
// //     };

// //     // Update status helper (vip/inquiry/decoration/photography)
// //     const updateStatus = async (bookingId, newStatus, serviceType) => {
// //         let endpoint = "";
// //         let setStateFunc = null;

// //         if (serviceType === "inquiry") {
// //             endpoint = `/contact/${bookingId}/status`;
// //             setStateFunc = setInquiries;
// //         } else if (serviceType === "decoration") {
// //             endpoint = `/decoration/${bookingId}/status`;
// //             setStateFunc = setDecorationBookings;
// //         } else if (serviceType === "photography") {
// //             endpoint = `/photography/${bookingId}/status`;
// //             setStateFunc = setPhotographyBookings;
// //         } else if (serviceType === "vip") {
// //             endpoint = `/vip/${bookingId}/status`;
// //             setStateFunc = setVipBookings;
// //         } else return;

// //         try {
// //             await axiosClient.put(endpoint, { status: newStatus });
// //             setStateFunc(prev => prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b)));
// //         } catch (err) {
// //             console.error(`Error updating ${serviceType} status:`, err);
// //             // fallback: re-fetch
// //             if (serviceType === "vip") fetchVipBookings();
// //             else if (serviceType === "inquiry") fetchInquiries();
// //             else if (serviceType === "decoration") fetchDecorationBookings();
// //             else if (serviceType === "photography") fetchPhotographyBookings();
// //         }
// //     };

// //     // Admin sends chat message — save to DB and emit
// //     // Admin sends chat message — save to DB and emit
// //     const sendAdminMessage = async () => {
// //         if (!adminMsg.trim()) return;

// //         // 🚨 Ensure the user is logged in and has an ID
// //         const senderId = user?._id || user?.id; if (!senderId) {
// //             console.error("Cannot send message: Admin user ID is missing.");
// //             return; // Prevents the API call if auth context is incomplete
// //         }

// //         const msg = {
// //             sender: "Admin",
// //             text: adminMsg.trim(),
// //             time: new Date().toLocaleTimeString(),
// //             // 🆕 Include the user ID here if the backend expects it in the body
// //             // Note: A well-designed backend usually gets this from the token (req.user), 
// //             // but if the route doesn't use the 'protect' middleware, this is necessary.
// //             userId: senderId
// //         };

// //         try {
// //             // Update API call to use the full msg object or check backend
// //             // Assuming the backend Query model requires a 'userId' or 'senderId' 
// //             // which is why the request is failing validation (400)
// //             await axiosClient.post("/queries", msg);

// //             // ... (socket emit and state update) ...
// //             socket.emit("vipChatMessage", msg);
// //             setAdminMsg("");
// //             setChat(prev => [...prev, { ...msg, createdAt: new Date().toISOString() }]);
// //         } catch (err) {
// //             console.error("Failed to send admin message:", err);
// //         }
// //     };

// //     // Socket listeners + initial fetch
// //     useEffect(() => {
// //         socket.on("vipChatUpdate", (data) => {
// //             // data: { sender, text, time }
// //             // save local view (server also saves)
// //             setChat(prev => [...prev, data]);
// //         });

// //         socket.on("vipHallRealtimeUpdate", (payload) => {
// //             // simple approach: re-fetch halls to keep consistent
// //             fetchVipHalls();
// //         });

// //         const loadData = async () => {
// //             if (!isAdmin) {
// //                 setLoading(false);
// //                 return;
// //             }
// //             setLoading(true);
// //             await Promise.all([
// //                 fetchInquiries(),
// //                 fetchDecorationBookings(),
// //                 fetchPhotographyBookings(),
// //                 fetchQueries(),
// //                 fetchVipBookings(),
// //                 fetchVipHalls()
// //             ]);
// //             setLoading(false);
// //         };

// //         loadData();

// //         return () => {
// //             socket.off("vipChatUpdate");
// //             socket.off("vipHallRealtimeUpdate");
// //         };
// //     }, [isAdmin, fetchInquiries, fetchDecorationBookings, fetchPhotographyBookings, fetchQueries, fetchVipBookings, fetchVipHalls]);

// //     if (!isAdmin) return <p className="admin-error">Access Denied. Admins only.</p>;
// //     if (loading) return <p className="text-blue-500">Loading Admin Portal Data...</p>;
// //     if (error) return <p className="admin-error">{error}</p>;

// //     const tabs = [
// //         { id: "vip", label: `VIP Bookings (${vipBookings.length})`, Icon: GiBigDiamondRing },
// //         { id: "hall-management", label: `Hall Management (${vipHalls.length})`, Icon: FaPlus },
// //         { id: "inquiries", label: `Inquiries (${inquiries.length})`, Icon: FaConciergeBell },
// //         { id: "decoration", label: `Decoration (${decorationBookings.length})`, Icon: FaPalette },
// //         { id: "photography", label: `Photography (${photographyBookings.length})`, Icon: FaCamera },
// //         { id: "chat", label: `Live Chat (${chat.length})`, Icon: FaCommentDots },
// //     ];

// //     return (
        
// //         <div className="admin-dashboard">
// //                       <div className="admin-dashboard">
// //       <div className="admin-header">
// //         <h2>Admin Dashboard</h2>
// //         <button
// //           className="store-btn"
// //           onClick={() => navigate("/admin/store")}
// //         >
// //           🛒 Manage Store
// //         </button>
// //       </div>

// //       <div className="admin-cards">
// //         <div className="admin-card" onClick={() => navigate("/admin/users")}>
// //           <h3>👥 Manage Users</h3>
// //           <p>View, update, and delete users</p>
// //         </div>

// //         <div className="admin-card" onClick={() => navigate("/admin/events")}>
// //           <h3>🎉 Manage Events</h3>
// //           <p>Approve, reject, or remove events</p>
// //         </div>

// //         <div className="admin-card" onClick={() => navigate("/admin/orders")}>
// //           <h3>📦 Manage Orders</h3>
// //           <p>Track and handle all event orders</p>
// //         </div>
// //       </div>
// //     </div>
// //             <h1>Admin Portal Dashboard</h1>

// //             <nav className="admin-tabs">
// //                 {tabs.map(tab => (
// //                     <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
// //                         <tab.Icon /> {tab.label}
// //                     </button>

// //                 ))}
// //             </nav>

// //             {activeTab === "vip" && (
// //                 <section className="admin-content-section">
// //                     <h2>Exclusive VIP Wedding Requests</h2>
// //                     {vipBookings.length === 0 ? <p>No VIP booking requests have been submitted yet.</p> : (
// //                         <div className="bookings-grid">
// //                             {vipBookings.map(b => {
// //                                 const { _id, userId, city, weddingDate, guestCount, totalBudget, selectedVenue, requiredServices, status = "Pending Quote" } = b;
// //                                 const statusClass = status.toLowerCase().replace(/\s/g, "-");

// //                                 // 🆕 UPDATED FIELD EXTRACTION TO DISPLAY CUSTOM FIELDS
// //                                 const decorationTheme = requiredServices?.decorationTheme || "Standard Decor";
// //                                 const haldiTeamRequired = requiredServices?.haldiTeam ? "Required (Yes)" : "No";

// //                                 return (
// //                                     <div key={_id} className="admin-card vip-card">
// //                                         <h3>VIP Request - {city}</h3>
// //                                         <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
// //                                         <p><strong>User:</strong> {userId?.name || "Unknown User"}</p>
// //                                         <p><strong>Email:</strong> {userId?.email || "N/A"}</p>
// //                                         <p><strong>Date:</strong> {formatDate(weddingDate)}</p>
// //                                         <p><strong>Guests:</strong> {guestCount}</p>
// //                                         <p><strong>Budget:</strong> ₹{totalBudget?.toLocaleString()}</p>
// //                                         <p><strong>Venue:</strong> {selectedVenue?.name || "Venue Not Specified"}</p>

// //                                         {/* 🆕 UPDATED DISPLAY */}
// //                                         <p><strong>Services:</strong> {decorationTheme}</p>
// //                                         <p><strong>Haldi Team:</strong> {haldiTeamRequired}</p>

// //                                         <div className="admin-actions">
// //                                             {status !== "Quote Sent" && <button className="accept-btn" onClick={() => updateStatus(_id, "Quote Sent", "vip")}>Quote Sent</button>}
// //                                             {status !== "Booked" && <button className="complete-btn" onClick={() => updateStatus(_id, "Booked", "vip")}>Booked</button>}
// //                                             {status !== "Pending Quote" && <button className="pending-btn" onClick={() => updateStatus(_id, "Pending Quote", "vip")}>Reset Pending</button>}
// //                                         </div>
// //                                     </div>
// //                                 );
// //                             })}
// //                         </div>
// //                     )}
// //                 </section>
// //             )}

// //             {activeTab === "hall-management" && (
// //                 <section className="admin-content-section hall-management-section">
// //                     <h2>Manage VIP Function Halls</h2>

// //                     <form onSubmit={handleAddHall} className="add-hall-form admin-card">
// //                         <h3><FaPlus /> Add New Exclusive Venue</h3>
// //                         <input value={newHall.name} onChange={(e) => setNewHall({ ...newHall, name: e.target.value })} placeholder="Venue Name" required />
// //                         <select value={newHall.city} onChange={(e) => setNewHall({ ...newHall, city: e.target.value })}>
// //                             {hallCities.map(c => <option key={c} value={c}>{c}</option>)}
// //                         </select>
// //                         <input value={newHall.capacity} onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })} placeholder="Capacity" type="number" required />
// //                         <input value={newHall.vipPrice} onChange={(e) => setNewHall({ ...newHall, vipPrice: e.target.value })} placeholder="VIP Price (INR)" type="number" required />
// //                         <input value={newHall.amenities} onChange={(e) => setNewHall({ ...newHall, amenities: e.target.value })} placeholder="Amenities (comma separated)" />
// //                         <button type="submit" className="accept-btn"><FaPlus /> Add Hall</button>
// //                     </form>

// //                     <div className="hall-list">
// //                         <h3>Existing VIP Venues ({vipHalls.length})</h3>
// //                         <div className="bookings-grid">
// //                             {vipHalls.map(h => (
// //                                 <div key={h._id} className="admin-card hall-card">
// //                                     <h4>{h.name} - {h.city}</h4>
// //                                     <p>Capacity: <strong>{h.capacity}</strong></p>
// //                                     <p>VIP Price: <strong>₹{h.vipPrice}</strong></p>
// //                                     <p>Amenities: {(h.amenities || []).join(", ") || "N/A"}</p>
// //                                     <button onClick={() => handleDeleteHall(h._id)} className="delete-btn"><FaTrash /> Delete</button>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </section>
// //             )}

// //             {/* 🛑 INQUIRIES SECTION - UNCHANGED AS REQUESTED */}
// //             {activeTab === "inquiries" && (
// //                 <section className="admin-content-section">
// //                     <h2>Customer Inquiries</h2>
// //                     {inquiries.length === 0 ? <p>No customer inquiries have been submitted yet.</p> : (
// //                         <div className="bookings-grid">
// //                             {inquiries.map(q => {
// //                                 const { _id, name, email, phone, eventType, eventDate, eventLocation, profession, message, submittedAt, status = "Pending" } = q;
// //                                 const statusClass = status.toLowerCase();
// //                                 return (
// //                                     <div key={_id} className="admin-card">
// //                                         <h3>{eventType || "General Inquiry"}</h3>
// //                                         <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
// //                                         <p><strong>Name:</strong> {name}</p>
// //                                         <p><strong>Email:</strong> {email}</p>
// //                                         <p><strong>Phone:</strong> {phone || "N/A"}</p>
// //                                         <p><strong>Event Date:</strong> {formatDate(eventDate)}</p>
// //                                         <p><strong>Location:</strong> {eventLocation || "N/A"}</p>
// //                                         <p><strong>Profession:</strong> {profession || "N/A"}</p>
// //                                         <p><strong>Message:</strong> {message}</p>
// //                                         <small>Submitted: {formatDate(submittedAt)}</small>
// //                                         <div className="admin-actions">
// //                                             {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "inquiry")} className="accept-btn">Contacted</button>}
// //                                             {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "inquiry")} className="complete-btn">Complete</button>}
// //                                             {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "inquiry")} className="pending-btn">Reset Pending</button>}
// //                                         </div>
// //                                     </div>
// //                                 );
// //                             })}
// //                         </div>
// //                     )}
// //                 </section>
// //             )}

// //             {/* 🛑 DECORATION SECTION - UNCHANGED AS REQUESTED */}
// //             {activeTab === "decoration" && (
// //                 <section className="admin-content-section">
// //                     <h2>Decoration Service Bookings</h2>
// //                     {decorationBookings.length === 0 ? <p>No decoration bookings have been submitted yet.</p> : (
// //                         <div className="bookings-grid">
// //                             {decorationBookings.map(b => {
// //                                 const { _id, userName, eventType, date, location, budget, message, status = "Pending" } = b;
// //                                 const statusClass = status.toLowerCase();
// //                                 return (
// //                                     <div key={_id} className="admin-card decoration-card">
// //                                         <h3>{eventType} Decoration</h3>
// //                                         <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
// //                                         <p><strong>Name:</strong> {userName}</p>
// //                                         <p><strong>Date:</strong> {formatDate(date)}</p>
// //                                         <p><strong>Location:</strong> {location}</p>
// //                                         <p><strong>Budget:</strong> ₹{budget || "N/A"}</p>
// //                                         <p><strong>Message:</strong> {message}</p>
// //                                         <div className="admin-actions">
// //                                             {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "decoration")} className="accept-btn">Contacted</button>}
// //                                             {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "decoration")} className="complete-btn">Complete</button>}
// //                                             {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "decoration")} className="pending-btn">Reset Pending</button>}
// //                                         </div>
// //                                     </div>
// //                                 );
// //                             })}
// //                         </div>
// //                     )}
// //                 </section>
// //             )}

// //             {/* 🛑 PHOTOGRAPHY SECTION - UNCHANGED AS REQUESTED */}
// //             {activeTab === "photography" && (
// //                 <section className="admin-content-section">
// //                     <h2>Photoshoot Bookings</h2>
// //                     {photographyBookings.length === 0 ? <p>No photoshoot bookings have been submitted yet.</p> : (
// //                         <div className="bookings-grid">
// //                             {photographyBookings.map(b => {
// //                                 const { _id, userName, eventType, packageType, durationHours, date, location, budget, message, status = "Pending" } = b;
// //                                 const statusClass = status.toLowerCase();
// //                                 return (
// //                                     <div key={_id} className="admin-card photography-card">
// //                                         <h3>{eventType} Photoshoot ({packageType})</h3>
// //                                         <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
// //                                         <p><strong>Name:</strong> {userName}</p>
// //                                         <p><strong>Date:</strong> {formatDate(date)}</p>
// //                                         <p><strong>Duration:</strong> {durationHours} hours</p>
// //                                         <p><strong>Location:</strong> {location}</p>
// //                                         <p><strong>Budget:</strong> ₹{budget || "N/A"}</p>
// //                                         <p><strong>Message:</strong> {message}</p>
// //                                         <div className="admin-actions">
// //                                             {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "photography")} className="accept-btn">Contacted</button>}
// //                                             {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "photography")} className="complete-btn">Complete</button>}
// //                                             {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "photography")} className="pending-btn">Reset Pending</button>}
// //                                         </div>
// //                                     </div>
// //                                 );
// //                             })}
// //                         </div>
// //                     )}
// //                 </section>
// //             )}

// //             {activeTab === "chat" && (
// //                 <section className="admin-content-section chat-section">
// //                     <h2><FaCommentDots /> VIP Live Chat</h2>
// //                     <div className="chat-box">
// //                         {chat.length === 0 ? <p>No messages yet.</p> : chat.map((m, i) => (
// //                             <div key={i} className={`chat-message ${m.sender === "Admin" ? "admin" : "user"}`}>
// //                                 <strong>{m.sender}</strong>: {m.text} <span className="chat-time">{m.time || formatDate(m.createdAt)}</span>
// //                             </div>
// //                         ))}
// //                     </div>
// //                     <div className="chat-input">
// //                         <input value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} placeholder="Type a message to VIP users..." />
// //                         <button onClick={sendAdminMessage}>Send</button>
// //                     </div>
// //                 </section>
// //             )}
// //         </div>

// //     );

// // }
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosClient from "../utils/axiosClient";
// import { useAuth } from "../context/AuthContext";
// import "../styles/AdminDashboard.css";
// import { io } from "socket.io-client";

// // Icons
// let FaCamera, FaPalette, FaConciergeBell, FaCommentDots, GiBigDiamondRing, FaPlus, FaTrash;
// try {
//   const FaIcons = require("react-icons/fa");
//   FaCamera = FaIcons.FaCamera;
//   FaPalette = FaIcons.FaPalette;
//   FaConciergeBell = FaIcons.FaConciergeBell;
//   FaCommentDots = FaIcons.FaCommentDots;
//   FaPlus = FaIcons.FaPlus;
//   FaTrash = FaIcons.FaTrash;
//   const GiIcons = require("react-icons/gi");
//   GiBigDiamondRing = GiIcons.GiBigDiamondRing;
// } catch (e) {
//   FaCamera = () => <span>📸</span>;
//   FaPalette = () => <span>🎨</span>;
//   FaConciergeBell = () => <span>🛎️</span>;
//   FaCommentDots = () => <span>💬</span>;
//   GiBigDiamondRing = () => <span>💍</span>;
//   FaPlus = () => <span>+</span>;
//   FaTrash = () => <span>🗑️</span>;
// }

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
// const socket = io(SOCKET_URL, { autoConnect: true });

// const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : "N/A");

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [inquiries, setInquiries] = useState([]);
//   const [decorationBookings, setDecorationBookings] = useState([]);
//   const [photographyBookings, setPhotographyBookings] = useState([]);
//   const [queries, setQueries] = useState([]);
//   const [vipBookings, setVipBookings] = useState([]);
//   const [vipHalls, setVipHalls] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("vip");
//   const [newHall, setNewHall] = useState({
//     name: "",
//     city: "Hyderabad",
//     capacity: "",
//     vipPrice: "",
//     amenities: "",
//   });
//   const hallCities = ["Hyderabad", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata"];
//   const [chat, setChat] = useState([]);
//   const [adminMsg, setAdminMsg] = useState("");

//   const isAdmin = user?.role === "admin";

//   // 🔹 FETCH HELPERS (same as before)
//   const fetchInquiries = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/contact");
//       setInquiries(res.data);
//     } catch (err) {
//       setError("Failed to load inquiries.");
//     }
//   }, []);

//   const fetchDecorationBookings = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/decoration");
//       setDecorationBookings(res.data);
//     } catch {}
//   }, []);

//   const fetchPhotographyBookings = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/photography");
//       setPhotographyBookings(res.data);
//     } catch {}
//   }, []);

//   const fetchQueries = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/queries");
//       setQueries(res.data || []);
//       setChat(res.data || []);
//     } catch {}
//   }, []);

//   const fetchVipBookings = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/vip");
//       setVipBookings(res.data || []);
//     } catch {}
//   }, []);

//   const fetchVipHalls = useCallback(async () => {
//     try {
//       const res = await axiosClient.get("/vip/management/halls");
//       setVipHalls(res.data || []);
//     } catch {}
//   }, []);

//   // 🔹 ADD/DELETE HALLS
//   const handleAddHall = async (e) => {
//     e.preventDefault();
//     try {
//       const hallData = {
//         ...newHall,
//         capacity: parseInt(newHall.capacity, 10),
//         vipPrice: parseFloat(newHall.vipPrice),
//         amenities: newHall.amenities
//           ? newHall.amenities.split(",").map((a) => a.trim()).filter(Boolean)
//           : [],
//       };
//       const res = await axiosClient.post("/vip/management/halls", hallData);
//       const addedHall = res.data?.data || res.data;
//       socket.emit("vipHallUpdated", { type: "added", hall: addedHall });
//       setNewHall({ name: "", city: "Hyderabad", capacity: "", vipPrice: "", amenities: "" });
//       await fetchVipHalls();
//     } catch {
//       setError("Server error adding hall");
//     }
//   };

//   const handleDeleteHall = async (id) => {
//     if (!window.confirm("Delete this hall?")) return;
//     try {
//       await axiosClient.delete(`/vip/management/halls/${id}`);
//       socket.emit("vipHallUpdated", { type: "deleted", hallId: id });
//       fetchVipHalls();
//     } catch {
//       setError("Failed to delete hall.");
//     }
//   };

//   // 🔹 UPDATE STATUS (same logic)
//   const updateStatus = async (bookingId, newStatus, type) => {
//     let endpoint = "";
//     let setStateFunc = null;
//     if (type === "inquiry") {
//       endpoint = `/contact/${bookingId}/status`;
//       setStateFunc = setInquiries;
//     } else if (type === "decoration") {
//       endpoint = `/decoration/${bookingId}/status`;
//       setStateFunc = setDecorationBookings;
//     } else if (type === "photography") {
//       endpoint = `/photography/${bookingId}/status`;
//       setStateFunc = setPhotographyBookings;
//     } else if (type === "vip") {
//       endpoint = `/vip/${bookingId}/status`;
//       setStateFunc = setVipBookings;
//     } else return;

//     try {
//       await axiosClient.put(endpoint, { status: newStatus });
//       setStateFunc((prev) =>
//         prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔹 CHAT MESSAGE
//   const sendAdminMessage = async () => {
//     if (!adminMsg.trim()) return;
//     const msg = {
//       sender: "Admin",
//       text: adminMsg.trim(),
//       time: new Date().toLocaleTimeString(),
//       userId: user?._id,
//     };
//     try {
//       await axiosClient.post("/queries", msg);
//       socket.emit("vipChatMessage", msg);
//       setAdminMsg("");
//       setChat((prev) => [...prev, { ...msg, createdAt: new Date().toISOString() }]);
//     } catch {}
//   };

//   // 🔹 SOCKET + INITIAL FETCH
//   useEffect(() => {
//     socket.on("vipChatUpdate", (data) => setChat((prev) => [...prev, data]));
//     socket.on("vipHallRealtimeUpdate", fetchVipHalls);

//     const load = async () => {
//       if (!isAdmin) return setLoading(false);
//       setLoading(true);
//       await Promise.all([
//         fetchInquiries(),
//         fetchDecorationBookings(),
//         fetchPhotographyBookings(),
//         fetchQueries(),
//         fetchVipBookings(),
//         fetchVipHalls(),
//       ]);
//       setLoading(false);
//     };
//     load();

//     return () => {
//       socket.off("vipChatUpdate");
//       socket.off("vipHallRealtimeUpdate");
//     };
//   }, [isAdmin, fetchInquiries, fetchDecorationBookings, fetchPhotographyBookings, fetchQueries, fetchVipBookings, fetchVipHalls]);

//   if (!isAdmin) return <p>Access Denied. Admins only.</p>;
//   if (loading) return <p>Loading Admin Portal...</p>;
//   if (error) return <p className="admin-error">{error}</p>;

//   // 🔹 Tabs (same)
//   const tabs = [
//     { id: "vip", label: `VIP Bookings (${vipBookings.length})`, Icon: GiBigDiamondRing },
//     { id: "hall-management", label: `Hall Management (${vipHalls.length})`, Icon: FaPlus },
//     { id: "inquiries", label: `Inquiries (${inquiries.length})`, Icon: FaConciergeBell },
//     { id: "decoration", label: `Decoration (${decorationBookings.length})`, Icon: FaPalette },
//     { id: "photography", label: `Photography (${photographyBookings.length})`, Icon: FaCamera },
//     { id: "chat", label: `Live Chat (${chat.length})`, Icon: FaCommentDots },
//   ];

//   return (
//     <div className="admin-dashboard">
//       <div className="admin-header">
//         <h2>Admin Dashboard</h2>
//         {/* ✅ Redirects to ProductForm */}
//         <button className="store-btn" onClick={() => navigate("/admin/store")}>
//           🛒 Manage Store
//         </button>
//       </div>

//       <h1>Admin Portal Dashboard</h1>

//       <nav className="admin-tabs">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
//             onClick={() => setActiveTab(tab.id)}
//           >
//             <tab.Icon /> {tab.label}
//           </button>
//         ))}
//       </nav>

//       {/* ✅ Existing tab contents (VIP, Hall, Inquiries, etc.) remain same */}
//       {/* You can keep your previous sections below here unchanged */}
      
//     </div>

//   );
// }
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css";
import { io } from "socket.io-client";

// Icons
let FaCamera, FaPalette, FaConciergeBell, FaCommentDots, GiBigDiamondRing, FaPlus, FaTrash;
try {
  const FaIcons = require("react-icons/fa");
  FaCamera = FaIcons.FaCamera;
  FaPalette = FaIcons.FaPalette;
  FaConciergeBell = FaIcons.FaConciergeBell;
  FaCommentDots = FaIcons.FaCommentDots;
  FaPlus = FaIcons.FaPlus;
  FaTrash = FaIcons.FaTrash;
  const GiIcons = require("react-icons/gi");
  GiBigDiamondRing = GiIcons.GiBigDiamondRing;
} catch (e) {
  FaCamera = () => <span>📸</span>;
  FaPalette = () => <span>🎨</span>;
  FaConciergeBell = () => <span>🛎️</span>;
  FaCommentDots = () => <span>💬</span>;
  GiBigDiamondRing = () => <span>💍</span>;
  FaPlus = () => <span>+</span>;
  FaTrash = () => <span>🗑️</span>;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
const socket = io(SOCKET_URL, { autoConnect: true });

const formatDate = (dateString) => (dateString ? new Date(dateString).toLocaleString() : "N/A");

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [decorationBookings, setDecorationBookings] = useState([]);
  const [photographyBookings, setPhotographyBookings] = useState([]);
  const [queries, setQueries] = useState([]);
  const [vipBookings, setVipBookings] = useState([]);
  const [vipHalls, setVipHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("vip");
  const [newHall, setNewHall] = useState({
    name: "",
    city: "Hyderabad",
    capacity: "",
    vipPrice: "",
    amenities: "",
  });
  const hallCities = ["Hyderabad", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata"];
  const [chat, setChat] = useState([]);
  const [adminMsg, setAdminMsg] = useState("");

  const isAdmin = user?.role === "admin";

  // 🔹 FETCH HELPERS
  const fetchInquiries = useCallback(async () => {
    try {
      const res = await axiosClient.get("/contact");
      setInquiries(res.data);
    } catch (err) {
      setError("Failed to load inquiries.");
    }
  }, []);

  const fetchDecorationBookings = useCallback(async () => {
    try {
      const res = await axiosClient.get("/decoration");
      setDecorationBookings(res.data);
    } catch {}
  }, []);

  const fetchPhotographyBookings = useCallback(async () => {
    try {
      const res = await axiosClient.get("/photography");
      setPhotographyBookings(res.data);
    } catch {}
  }, []);

  const fetchQueries = useCallback(async () => {
    try {
      const res = await axiosClient.get("/queries");
      setQueries(res.data || []);
      setChat(res.data || []);
    } catch {}
  }, []);

  const fetchVipBookings = useCallback(async () => {
    try {
      const res = await axiosClient.get("/vip");
      setVipBookings(res.data || []);
    } catch {}
  }, []);

  const fetchVipHalls = useCallback(async () => {
    try {
      const res = await axiosClient.get("/vip/management/halls");
      setVipHalls(res.data || []);
    } catch {}
  }, []);

  // 🔹 ADD/DELETE HALLS
  const handleAddHall = async (e) => {
    e.preventDefault();
    try {
      const hallData = {
        ...newHall,
        capacity: parseInt(newHall.capacity, 10),
        vipPrice: parseFloat(newHall.vipPrice),
        amenities: newHall.amenities
          ? newHall.amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };
      const res = await axiosClient.post("/vip/management/halls", hallData);
      const addedHall = res.data?.data || res.data;
      socket.emit("vipHallUpdated", { type: "added", hall: addedHall });
      setNewHall({ name: "", city: "Hyderabad", capacity: "", vipPrice: "", amenities: "" });
      await fetchVipHalls();
    } catch {
      setError("Server error adding hall");
    }
  };

  const handleDeleteHall = async (id) => {
    if (!window.confirm("Delete this hall?")) return;
    try {
      await axiosClient.delete(`/vip/management/halls/${id}`);
      socket.emit("vipHallUpdated", { type: "deleted", hallId: id });
      fetchVipHalls();
    } catch {
      setError("Failed to delete hall.");
    }
  };

  // 🔹 UPDATE STATUS
  const updateStatus = async (bookingId, newStatus, type) => {
    let endpoint = "";
    let setStateFunc = null;
    if (type === "inquiry") {
      endpoint = `/contact/${bookingId}/status`;
      setStateFunc = setInquiries;
    } else if (type === "decoration") {
      endpoint = `/decoration/${bookingId}/status`;
      setStateFunc = setDecorationBookings;
    } else if (type === "photography") {
      endpoint = `/photography/${bookingId}/status`;
      setStateFunc = setPhotographyBookings;
    } else if (type === "vip") {
      endpoint = `/vip/${bookingId}/status`;
      setStateFunc = setVipBookings;
    } else return;

    try {
      await axiosClient.put(endpoint, { status: newStatus });
      setStateFunc((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 CHAT MESSAGE
  const sendAdminMessage = async () => {
    if (!adminMsg.trim()) return;
    const msg = {
      sender: "Admin",
      text: adminMsg.trim(),
      time: new Date().toLocaleTimeString(),
      userId: user?._id,
    };
    try {
      await axiosClient.post("/queries", msg);
      socket.emit("vipChatMessage", msg);
      setAdminMsg("");
      setChat((prev) => [...prev, { ...msg, createdAt: new Date().toISOString() }]);
    } catch {}
  };

  // 🔹 SOCKET + INITIAL FETCH
  useEffect(() => {
    socket.on("vipChatUpdate", (data) => setChat((prev) => [...prev, data]));
    socket.on("vipHallRealtimeUpdate", fetchVipHalls);

    const load = async () => {
      if (!isAdmin) return setLoading(false);
      setLoading(true);
      await Promise.all([
        fetchInquiries(),
        fetchDecorationBookings(),
        fetchPhotographyBookings(),
        fetchQueries(),
        fetchVipBookings(),
        fetchVipHalls(),
      ]);
      setLoading(false);
    };
    load();

    return () => {
      socket.off("vipChatUpdate");
      socket.off("vipHallRealtimeUpdate");
    };
  }, [isAdmin, fetchInquiries, fetchDecorationBookings, fetchPhotographyBookings, fetchQueries, fetchVipBookings, fetchVipHalls]);

  if (!isAdmin) return <p>Access Denied. Admins only.</p>;
  if (loading) return <p>Loading Admin Portal...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  // 🔹 Tabs
  const tabs = [
    { id: "vip", label: `VIP Bookings (${vipBookings.length})`, Icon: GiBigDiamondRing },
    { id: "hall-management", label: `Hall Management (${vipHalls.length})`, Icon: FaPlus },
    { id: "inquiries", label: `Inquiries (${inquiries.length})`, Icon: FaConciergeBell },
    { id: "decoration", label: `Decoration (${decorationBookings.length})`, Icon: FaPalette },
    { id: "photography", label: `Photography (${photographyBookings.length})`, Icon: FaCamera },
    { id: "chat", label: `Live Chat (${chat.length})`, Icon: FaCommentDots },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="store-btn" onClick={() => navigate("/admin/store")}>
          🛒 Manage Store
        </button>
      </div>

      {/* Additional cards from the previous version of the code were included in the commented section. I will keep the cleaner, revised version that follows the header with tabs. */}
      <h1>Admin Portal Dashboard</h1>

      <nav className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.Icon /> {tab.label}
          </button>
        ))}
      </nav>
        
      {/* VIP Bookings Section (The full content was in the commented block, so I must add it here) */}
        {activeTab === "vip" && (
            <section className="admin-content-section">
                <h2>Exclusive VIP Wedding Requests</h2>
                {vipBookings.length === 0 ? <p>No VIP booking requests have been submitted yet.</p> : (
                    <div className="bookings-grid">
                        {vipBookings.map(b => {
                            const { _id, userId, city, weddingDate, guestCount, totalBudget, selectedVenue, requiredServices, status = "Pending Quote" } = b;
                            const statusClass = status.toLowerCase().replace(/\s/g, "-");
    
                            // Field extraction logic
                            const decorationTheme = requiredServices?.decorationTheme || "Standard Decor";
                            const haldiTeamRequired = requiredServices?.haldiTeam ? "Required (Yes)" : "No";
    
                            return (
                                <div key={_id} className="admin-card vip-card">
                                    <h3>VIP Request - {city}</h3>
                                    <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                    <p><strong>User:</strong> {userId?.name || "Unknown User"}</p>
                                    <p><strong>Email:</strong> {userId?.email || "N/A"}</p>
                                    <p><strong>Date:</strong> {formatDate(weddingDate)}</p>
                                    <p><strong>Guests:</strong> {guestCount}</p>
                                    <p><strong>Budget:</strong> ₹{totalBudget?.toLocaleString()}</p>
                                    <p><strong>Venue:</strong> {selectedVenue?.name || "Venue Not Specified"}</p>
    
                                    <p><strong>Services:</strong> {decorationTheme}</p>
                                    <p><strong>Haldi Team:</strong> {haldiTeamRequired}</p>
    
                                    <div className="admin-actions">
                                        {status !== "Quote Sent" && <button className="accept-btn" onClick={() => updateStatus(_id, "Quote Sent", "vip")}>Quote Sent</button>}
                                        {status !== "Booked" && <button className="complete-btn" onClick={() => updateStatus(_id, "Booked", "vip")}>Booked</button>}
                                        {status !== "Pending Quote" && <button className="pending-btn" onClick={() => updateStatus(_id, "Pending Quote", "vip")}>Reset Pending</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        )}
    
        {/* Hall Management Section */}
        {activeTab === "hall-management" && (
            <section className="admin-content-section hall-management-section">
                <h2>Manage VIP Function Halls</h2>
    
                <form onSubmit={handleAddHall} className="add-hall-form admin-card">
                    <h3><FaPlus /> Add New Exclusive Venue</h3>
                    <input value={newHall.name} onChange={(e) => setNewHall({ ...newHall, name: e.target.value })} placeholder="Venue Name" required />
                    <select value={newHall.city} onChange={(e) => setNewHall({ ...newHall, city: e.target.value })}>
                        {hallCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input value={newHall.capacity} onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })} placeholder="Capacity" type="number" required />
                    <input value={newHall.vipPrice} onChange={(e) => setNewHall({ ...newHall, vipPrice: e.target.value })} placeholder="VIP Price (INR)" type="number" required />
                    <input value={newHall.amenities} onChange={(e) => setNewHall({ ...newHall, amenities: e.target.value })} placeholder="Amenities (comma separated)" />
                    <button type="submit" className="accept-btn"><FaPlus /> Add Hall</button>
                </form>
    
                <div className="hall-list">
                    <h3>Existing VIP Venues ({vipHalls.length})</h3>
                    <div className="bookings-grid">
                        {vipHalls.map(h => (
                            <div key={h._id} className="admin-card hall-card">
                                <h4>{h.name} - {h.city}</h4>
                                <p>Capacity: <strong>{h.capacity}</strong></p>
                                <p>VIP Price: <strong>₹{h.vipPrice}</strong></p>
                                <p>Amenities: {(h.amenities || []).join(", ") || "N/A"}</p>
                                <button onClick={() => handleDeleteHall(h._id)} className="delete-btn"><FaTrash /> Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}
    
        {/* INQUIRIES SECTION */}
        {activeTab === "inquiries" && (
            <section className="admin-content-section">
                <h2>Customer Inquiries</h2>
                {inquiries.length === 0 ? <p>No customer inquiries have been submitted yet.</p> : (
                    <div className="bookings-grid">
                        {inquiries.map(q => {
                            const { _id, name, email, phone, eventType, eventDate, eventLocation, profession, message, submittedAt, status = "Pending" } = q;
                            const statusClass = status.toLowerCase();
                            return (
                                <div key={_id} className="admin-card">
                                    <h3>{eventType || "General Inquiry"}</h3>
                                    <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                    <p><strong>Name:</strong> {name}</p>
                                    <p><strong>Email:</strong> {email}</p>
                                    <p><strong>Phone:</strong> {phone || "N/A"}</p>
                                    <p><strong>Event Date:</strong> {formatDate(eventDate)}</p>
                                    <p><strong>Location:</strong> {eventLocation || "N/A"}</p>
                                    <p><strong>Profession:</strong> {profession || "N/A"}</p>
                                    <p><strong>Message:</strong> {message}</p>
                                    <small>Submitted: {formatDate(submittedAt)}</small>
                                    <div className="admin-actions">
                                        {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "inquiry")} className="accept-btn">Contacted</button>}
                                        {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "inquiry")} className="complete-btn">Complete</button>}
                                        {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "inquiry")} className="pending-btn">Reset Pending</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        )}
    
        {/* DECORATION SECTION */}
        {activeTab === "decoration" && (
            <section className="admin-content-section">
                <h2>Decoration Service Bookings</h2>
                {decorationBookings.length === 0 ? <p>No decoration bookings have been submitted yet.</p> : (
                    <div className="bookings-grid">
                        {decorationBookings.map(b => {
                            const { _id, userName, eventType, date, location, budget, message, status = "Pending" } = b;
                            const statusClass = status.toLowerCase();
                            return (
                                <div key={_id} className="admin-card decoration-card">
                                    <h3>{eventType} Decoration</h3>
                                    <p><strong>Status:</strong> <span className={`status-badge ${statusClass}`}>{status}</span></p>
                                    <p><strong>Name:</strong> {userName}</p>
                                    <p><strong>Date:</strong> {formatDate(date)}</p>
                                    <p><strong>Location:</strong> {location}</p>
                                    <p><strong>Budget:</strong> ₹{budget || "N/A"}</p>
                                    <p><strong>Message:</strong> {message}</p>
                                    <div className="admin-actions">
                                        {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "decoration")} className="accept-btn">Contacted</button>}
                                        {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "decoration")} className="complete-btn">Complete</button>}
                                        {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "decoration")} className="pending-btn">Reset Pending</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        )}
    
        {/* PHOTOGRAPHY SECTION */}
        {activeTab === "photography" && (
            <section className="admin-content-section">
                <h2>Photoshoot Bookings</h2>
                {photographyBookings.length === 0 ? <p>No photoshoot bookings have been submitted yet.</p> : (
                    <div className="bookings-grid">
                        {photographyBookings.map(b => {
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
                                    <p><strong>Budget:</strong> ₹{budget || "N/A"}</p>
                                    <p><strong>Message:</strong> {message}</p>
                                    <div className="admin-actions">
                                        {status !== "Contacted" && <button onClick={() => updateStatus(_id, "Contacted", "photography")} className="accept-btn">Contacted</button>}
                                        {status !== "Completed" && <button onClick={() => updateStatus(_id, "Completed", "photography")} className="complete-btn">Complete</button>}
                                        {status !== "Pending" && <button onClick={() => updateStatus(_id, "Pending", "photography")} className="pending-btn">Reset Pending</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        )}
    
        {/* CHAT SECTION */}
        {activeTab === "chat" && (
            <section className="admin-content-section chat-section">
                <h2><FaCommentDots /> VIP Live Chat</h2>
                <div className="chat-box">
                    {chat.length === 0 ? <p>No messages yet.</p> : chat.map((m, i) => (
                        <div key={i} className={`chat-message ${m.sender === "Admin" ? "admin" : "user"}`}>
                            <strong>{m.sender}</strong>: {m.text} <span className="chat-time">{m.time || formatDate(m.createdAt)}</span>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input value={adminMsg} onChange={(e) => setAdminMsg(e.target.value)} placeholder="Type a message to VIP users..." />
                    <button onClick={sendAdminMessage}>Send</button>
                </div>
            </section>
        )}

    </div>
  );
}