// import { useState } from "react";
// import axios from "axios";

// function ExclusiveServicesComp() {
//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     phone: "",
//     serviceType: "",
//     date: "",
//     location: "",
//     message: ""
//   });

//   const [status, setStatus] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:8080/api/exclusive-services", formData);
//       setStatus("✅ Booking submitted successfully!");
//       setFormData({ userName: "", email: "", phone: "", serviceType: "", date: "", location: "", message: "" });
//     } catch (err) {
//       setStatus("❌ Submission failed. Please try again.");
//     }
//   };

//   return (
//     <div className="exclusive-container">
//       <h2 className="text-center text-2xl font-bold mb-4">Exclusive Services Booking</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto">
//         <input name="userName" value={formData.userName} onChange={handleChange} placeholder="Full Name" required className="border p-2 rounded" />
//         <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="border p-2 rounded" />
//         <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="border p-2 rounded" />
//         <select name="serviceType" value={formData.serviceType} onChange={handleChange} required className="border p-2 rounded">
//           <option value="">Select Service Type</option>
//           <option value="Makeup">Makeup</option>
//           <option value="Jewelry">Jewelry</option>
//           <option value="Decoration">Decoration</option>
//         </select>
//         <input name="date" type="date" value={formData.date} onChange={handleChange} required className="border p-2 rounded" />
//         <input name="location" value={formData.location} onChange={handleChange} placeholder="Event Location" required className="border p-2 rounded" />
//         <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Additional Message (optional)" className="border p-2 rounded"></textarea>
//         <button type="submit" className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700">Submit Booking</button>
//       </form>
//       {status && <p className="mt-4 text-center text-lg">{status}</p>}
//     </div>
//   );
// }

// export default ExclusiveServicesComp;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/exclusiveServices.css";

// import { useAuth } from "../context/AuthContext";
// import axiosClient from "../utils/axiosClient";

// function ExclusiveServicesComp() {
//     const { isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         userName: "",
//         email: "",
//         serviceType: "Makeup Artist",
//         dateRequired: "",
//         targetPerson: "Bride",
//         serviceLocation: "",
//         goldWeight: "",
//         rentalDurationDays: "",
//         budget: "",
//         phone: user?.phone || "",
//         message: ""
//     });

//     const [statusMessage, setStatusMessage] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!isAuthenticated) {
//             setStatusMessage("Please log in to submit a service request.");
//             setTimeout(() => navigate("/login"), 1500);
//             return;
//         }

//         setLoading(true);
//         setStatusMessage('');

//         try {
//             const payload = {
//                 userName: formData.userName || user?.name,
//                 email: formData.email || user?.email,
//                 phone: formData.phone,
//                 serviceType: formData.serviceType,
//                 date: formData.dateRequired,
//                 location: formData.serviceLocation || "N/A",
//                 message: formData.message,
//                 goldWeight: formData.goldWeight || 0,
//                 rentalDurationDays: formData.rentalDurationDays || 1,
//                 budget: formData.budget || 0,
//             };


//             if (formData.serviceType === 'Makeup Artist') {
//                 payload.targetPerson = formData.targetPerson;
//                 payload.serviceLocation = formData.serviceLocation;
//             } else if (formData.serviceType === 'Jewelry Rental') {
//                 payload.goldWeight = formData.goldWeight ? Number(formData.goldWeight) : 0;
//                 payload.rentalDurationDays = formData.rentalDurationDays ? Number(formData.rentalDurationDays) : 1;
//             }

//             await axiosClient.post("/exclusive", payload);
//             setStatusMessage("✅ Request submitted successfully! We will contact you shortly.");

//             setFormData(prev => ({
//                 ...prev, dateRequired: '', targetPerson: 'Bride', serviceLocation: '',
//                 goldWeight: '', rentalDurationDays: '', budget: '', phone: user?.phone || '', message: ''
//             }));

//         } catch (err) {
//             console.error("Submission error:", err);
//             const msg = err.response?.data?.message || "Failed to submit request. Check if all required fields are valid.";
//             setStatusMessage(` ${msg}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const isMakeup = formData.serviceType === 'Makeup Artist';
//     const isJewelry = formData.serviceType === 'Jewelry Rental';

//     return (
//         <div className="exclusive-services-page p-6 bg-gray-50 min-h-screen flex justify-center items-center">
//             <div className="max-w-xl w-full bg-white shadow-2xl rounded-xl p-8 transform transition-all hover:shadow-3xl">
//                 <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">Exclusive Services</h1>
//                 <p className="text-gray-500 mb-8 text-center text-sm">Luxury bookings for your special day.</p>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {}
//                     <div className="p-3 border rounded-lg bg-indigo-50">
//                         <label htmlFor="serviceType" className="block text-sm font-bold text-indigo-700 mb-2">Service Required *</label>
//                         <select
//                             id="serviceType"
//                             name="serviceType"
//                             value={formData.serviceType}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition duration-150"
//                         >
//                             <option value="Makeup Artist">💄 Makeup Artist (Bride/Groom)</option>
//                             <option value="Jewelry Rental">💍 Gold Jewelry Rental</option>
//                         </select>
//                     </div>

//                     {}
//                     <div>
//                         <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Full Name *</label>
//                         <input
//                             type="text"
//                             id="userName"
//                             name="userName"
//                             value={formData.userName || ""}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                             placeholder="Enter your full name"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email || ""}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                             placeholder="Enter your email address"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="dateRequired" className="block text-sm font-medium text-gray-700">Date Required *</label>
//                         <input
//                             type="date"
//                             id="dateRequired"
//                             name="dateRequired"
//                             value={formData.dateRequired}
//                             onChange={handleChange}
//                             required
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
//                         <input
//                             type="tel"
//                             id="phone"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                             placeholder="e.g., 9876543210"
//                         />
//                     </div>

//                     {}
//                     {isMakeup && (
//                         <div className="p-4 border border-pink-200 rounded-lg bg-pink-50 space-y-4">
//                             <h4 className="font-semibold text-pink-700">Makeup Details</h4>
//                             <div>
//                                 <label htmlFor="targetPerson" className="block text-sm font-medium text-gray-700">Target Person</label>
//                                 <select
//                                     id="targetPerson"
//                                     name="targetPerson"
//                                     value={formData.targetPerson}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition duration-150"
//                                 >
//                                     <option value="Bride">Bride</option>
//                                     <option value="Groom">Groom</option>
//                                     <option value="Other">Other (e.g., Family)</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label htmlFor="serviceLocation" className="block text-sm font-medium text-gray-700">Venue/Location</label>
//                                 <input
//                                     type="text"
//                                     id="serviceLocation"
//                                     name="serviceLocation"
//                                     value={formData.serviceLocation}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                                     placeholder="e.g., Hotel Name or Residence"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {}
//                     {isJewelry && (
//                         <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50 space-y-4">
//                             <h4 className="font-semibold text-yellow-800">Jewelry Rental Details</h4>
//                             <div>
//                                 <label htmlFor="goldWeight" className="block text-sm font-medium text-gray-700">Gold Weight Requirement (Grams)</label>
//                                 <input
//                                     type="number"
//                                     id="goldWeight"
//                                     name="goldWeight"
//                                     value={formData.goldWeight}
//                                     onChange={handleChange}
//                                     min="0"
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                                     placeholder="e.g., 200 (Total grams needed)"
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="rentalDurationDays" className="block text-sm font-medium text-gray-700">Rental Duration (Days) *</label>
//                                 <input
//                                     type="number"
//                                     id="rentalDurationDays"
//                                     name="rentalDurationDays"
//                                     value={formData.rentalDurationDays}
//                                     onChange={handleChange}
//                                     min="1"
//                                     required
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                                     placeholder="e.g., 3"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {}
//                     <div>
//                         <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Approximate Budget (INR, Optional)</label>
//                         <input
//                             type="number"
//                             id="budget"
//                             name="budget"
//                             value={formData.budget}
//                             onChange={handleChange}
//                             min="0"
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                             placeholder="e.g., 50000"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Details / Customization Request</label>
//                         <textarea
//                             id="message"
//                             name="message"
//                             rows="3"
//                             value={formData.message}
//                             onChange={handleChange}
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                         ></textarea>
//                     </div>

//                     {statusMessage && (
//                         <p className={`text-center font-medium p-3 rounded-lg ${statusMessage.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                             {statusMessage}
//                         </p>
//                     )}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-300 transform hover:scale-[1.01]"
//                     >
//                         {loading ? 'Submitting...' : `Book Exclusive Service`}
//                     </button>
//                 </form>
//                 {!isAuthenticated && (
//                     <p className="mt-4 text-center text-red-500">Note: You must be logged in to submit this request.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ExclusiveServicesComp;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/exclusiveServices.css";

import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";

function ExclusiveServicesComp() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        serviceType: "Makeup Artist",
        dateRequired: "",
        targetPerson: "Bride",
        serviceLocation: "",
        goldWeight: "",
        rentalDurationDays: "",
        budget: "",
        phone: user?.phone || "",
        message: ""
    });

    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]); // store previous bookings

    // Fetch user's previous bookings
    const fetchBookings = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await axiosClient.get(`/exclusive/user/${user?.id}`);
            setBookings(response.data); // assuming response.data is an array of bookings
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [isAuthenticated]);

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
            setStatusMessage("✅ Request submitted successfully! We will contact you shortly.");

            // Reset form
            setFormData(prev => ({
                ...prev, dateRequired: '', targetPerson: 'Bride', serviceLocation: '',
                goldWeight: '', rentalDurationDays: '', budget: '', phone: user?.phone || '', message: ''
            }));

            fetchBookings(); // refresh bookings immediately

        } catch (err) {
            console.error("Submission error:", err);
            const msg = err.response?.data?.message || "Failed to submit request. Check if all required fields are valid.";
            setStatusMessage(`❌ ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const isMakeup = formData.serviceType === 'Makeup Artist';
    const isJewelry = formData.serviceType === 'Jewelry Rental';

    return (
        <div className="exclusive-services-page">
            {/* ------------------ Booking Form ------------------ */}
            <div className="form-card">
                <h1>Exclusive Services</h1>
                <p>Luxury bookings for your special day.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Type */}
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

                    {/* Name, Email, Date */}
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

                    {/* Conditional Fields */}
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
                    {bookings.map((b) => (
                        <div key={b._id} className="booking-card">
                            <h3>{b.serviceType}</h3>
                            <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                            {b.targetPerson && <p><strong>For:</strong> {b.targetPerson}</p>}
                            {b.serviceLocation && <p><strong>Location:</strong> {b.serviceLocation}</p>}
                            {b.goldWeight && <p><strong>Gold Weight:</strong> {b.goldWeight}g</p>}
                            {b.rentalDurationDays && <p><strong>Duration:</strong> {b.rentalDurationDays} days</p>}
                            {b.budget && <p><strong>Budget:</strong> ₹{b.budget}</p>}
                            {b.message && <p><strong>Message:</strong> {b.message}</p>}
                            <p><strong>Status:</strong> {b.status || "Pending"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExclusiveServicesComp;
