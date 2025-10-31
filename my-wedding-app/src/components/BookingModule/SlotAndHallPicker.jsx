// src/components/booking/SlotAndHallPicker.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import StripePaymentPortal from './StripePaymentPortal';
// import { useAuth } from '../../context/AuthContext'; 
import "../../styles/bookingStyles.css"; 

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const SLOTS = ['Morning (9 AM - 2 PM)', 'Evening (5 PM - 10 PM)', 'Full Day'];

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

export default function SlotAndHallPicker({ location, area, eventType }) {
    const [halls, setHalls] = useState([]);
    const [selectedHall, setSelectedHall] = useState(null);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    // const { token, user } = useAuth(); // Example of getting auth details

    useEffect(() => {
        const fetchHalls = async () => {
            setLoading(true);
            setHalls([]);
            setFetchError(null);
            try {
                const res = await axios.get(`${API_URL}/booking/halls?location=${location}&area=${area}`);
                setHalls(res.data);
            } catch (err) {
                console.error('Error fetching halls:', err);
                setFetchError("Failed to fetch halls. Please check server connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchHalls();
    }, [location, area]);

    useEffect(() => {
        if (selectedHall && selectedDate) {
            const checkAvailability = async () => {
                // Reset selected slot to prevent user booking a now-unavailable slot
                setSelectedSlot(null);
                try {
                    // NOTE: The backend API MUST ONLY return slots where status is 'Confirmed'
                    const res = await axios.get(`${API_URL}/booking/availability/${selectedHall._id}/${selectedDate}`);
                    setBookedSlots(res.data.bookedSlots);
                } catch (err) {
                    console.error('Error checking availability:', err);
                    setBookedSlots([]);
                }
            };
            checkAvailability();
        }
    }, [selectedHall, selectedDate]);

    useEffect(() => {
        setSelectedHall(null);
        setBookingDetails(null);
        setSelectedSlot(null);
    }, [location, area]);


    const isSlotBooked = (slot) => {
        // The bookedSlots array only contains 'Confirmed' slots based on the API response
        if (bookedSlots.includes('Full Day')) return true;
        if (bookedSlots.includes(slot)) return true;
        return false;
    };

    const handleProceedToPayment = async () => {
        if (!selectedHall || !selectedDate || !selectedSlot) {
            // Replaced alert with custom handling or a console error for robust apps
            console.error('Please select a hall, date, and time slot.');
            setFetchError('Please select a hall, date, and time slot.');
            return;
        }
        setFetchError(null);
        setLoading(true);
        // IMPORTANT: Replace DUMMY_USER_ID with the actual user ID from context/state
        const DUMMY_USER_ID = '60c72b2f9a9c1e0015f8a0a1';

        const bookingData = {
            user: DUMMY_USER_ID,
            hall: selectedHall._id,
            eventType,
            date: selectedDate,
            timeSlot: selectedSlot,
            totalAmount: selectedHall.pricePerDay || 10000,
        };

        try {
            // Backend creates a booking with status: 'Pending_Payment'
            const res = await axios.post(`${API_URL}/booking/create`, bookingData);
            setBookingDetails({
                bookingId: res.data.bookingId,
                amount: res.data.amount,
                // You might also pass paymentIntentId if created on backend
            });
        } catch (err) {
            // Replaced alert with custom handling
            setFetchError(`Booking failed: ${err.response?.data?.message || 'Server error'}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ➡️ UPDATED: Confirm booking status after payment success
    const handlePaymentSuccess = async (paymentResponseData) => {
        // 1. Display success message (using console.log instead of alert)
        console.log('Payment Successful! Confirming your booking status...');

        setLoading(true);
        try {
            // 2. Call backend to update booking status to 'Confirmed'
            // 💡 ASSUMPTION: API endpoint PUT /booking/confirm/:bookingId
            await axios.put(`${API_URL}/booking/confirm/${bookingDetails.bookingId}`, {
                // You might pass transaction details here if needed
                paymentIntentId: paymentResponseData?.paymentIntentId,
            });

            // 3. Update local state to reflect the confirmed booking
            setBookedSlots((prevSlots) => [...prevSlots, selectedSlot]);
            alert('Booking Confirmed! Check your email for details.');

        } catch (err) {
            console.error('Error confirming booking:', err);
            alert('Payment was successful, but there was an issue confirming the booking on the server. Please contact support with your payment ID.');
        } finally {
            setLoading(false);
            setBookingDetails(null);
            setSelectedSlot(null);
        }
    };


    if (bookingDetails) {
        return (
            <div className="payment-portal-container">
                <StripePaymentPortal
                    bookingId={bookingDetails.bookingId}
                    amount={bookingDetails.amount}
                    // Pass a function that takes the payment response data (e.g., paymentIntentId)
                    onSuccess={handlePaymentSuccess}
                />
            </div>
        );
    }

    return (
        <div className="hall-picker-grid">
            {/* Hall Selection Column */}
            <div className="hall-list">
                <h4 className="hall-picker-title">Select Hall</h4>
                {loading && <p>Loading halls...</p>}
                {!loading && fetchError && <p className="error-message">{fetchError}</p>}
                {!loading && !fetchError && halls.length === 0 && <p className="error-message">No halls found in this area.</p>}
                {halls.map(hall => (
                    <div
                        key={hall._id}
                        onClick={() => setSelectedHall(hall)}
                        className={`hall-item ${selectedHall?._id === hall._id ? 'selected' : ''}`}
                    >
                        <p className="name">{hall.hallName}</p>
                        <p className="details">Capacity: {hall.capacity} Guests</p>
                        <p className="details">Price: ₹{hall.pricePerDay?.toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>

            {/* Date and Slot Column */}
            <div>
                {selectedHall ? (
                    <div className="slot-hall-details">
                        <h4 className="hall-picker-title">Choose Date & Slot for **{selectedHall.hallName}**</h4>

                        {/* Date Picker */}
                        <div className="date-picker-container">
                            <label>Event Date</label>
                            <input
                                type="date"
                                min={formatDate(new Date())}
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedSlot(null);
                                }}
                            />
                        </div>

                        {/* Slot Selector */}
                        <div className="slot-selector-grid">
                            {SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    disabled={isSlotBooked(slot)}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`slot-button ${isSlotBooked(slot) ? 'booked' :
                                        selectedSlot === slot ? 'selected' : 'available'
                                        }`}
                                >
                                    {slot}
                                    {isSlotBooked(slot) && <span className="slot-booked-text">Booked</span>}
                                </button>
                            ))}
                        </div>

                        {/* Booking Summary and Button */}
                        <div className="booking-summary-actions">
                            {selectedSlot ? (
                                <div className="booking-summary-text">
                                    Selected: **{selectedDate}** at **{selectedSlot}**
                                </div>
                            ) : (
                                <p className="error-message">Please select a date and time slot to proceed.</p>
                            )}

                            <button
                                onClick={handleProceedToPayment}
                                disabled={!selectedHall || !selectedDate || !selectedSlot || loading}
                                className="proceed-button"
                            >
                                {loading ? 'Initiating Booking...' : `Proceed to Pay ₹${selectedHall.pricePerDay?.toLocaleString('en-IN') || '10,000'}`}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="empty-hall-message">
                        <p>👈 Please select a Function Hall to view availability.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
