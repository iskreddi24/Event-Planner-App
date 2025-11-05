// src/components/booking/SlotAndHallPicker.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import StripePaymentPortal from './StripePaymentPortal';
import "../../styles/bookingStyles.css";

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const SLOTS = ['Morning (9 AM - 2 PM)', 'Evening (5 PM - 10 PM)', 'Full Day'];

// Format date for input[type="date"]
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

export default function SlotAndHallPicker({ location, area, eventType }) {
    // ✅ React hooks must be inside component
    const [notification, setNotification] = useState(null);
    const [halls, setHalls] = useState([]);
    const [selectedHall, setSelectedHall] = useState(null);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    // ✅ Simple reusable notification helper
    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 2500); // Auto hide after 2.5s
    };

    // Fetch halls based on location/area
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

    // Check booked slots whenever hall/date changes
    useEffect(() => {
        if (selectedHall && selectedDate) {
            const checkAvailability = async () => {
                setSelectedSlot(null);
                try {
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

    // Reset hall & slot when user changes location or area
    useEffect(() => {
        setSelectedHall(null);
        setBookingDetails(null);
        setSelectedSlot(null);
    }, [location, area]);

    // Slot booking validation
    const isSlotBooked = (slot) => {
        if (bookedSlots.includes('Full Day')) return true;
        if (bookedSlots.includes(slot)) return true;
        return false;
    };

    // Booking handler
    const handleProceedToPayment = async () => {
        if (!selectedHall || !selectedDate || !selectedSlot) {
            showNotification("Please select a hall, date, and slot", "warning");
            setFetchError('Please select a hall, date, and time slot.');
            return;
        }
        showNotification("Processing booking...", "info");
        setFetchError(null);
        setLoading(true);

        const DUMMY_USER_ID = '60c72b2f9a9c1e0015f8a0a1'; // Replace with real user ID

        const bookingData = {
            user: DUMMY_USER_ID,
            hall: selectedHall._id,
            eventType,
            date: selectedDate,
            timeSlot: selectedSlot,
            totalAmount: selectedHall.pricePerDay || 10000,
        };

        try {
            const res = await axios.post(`${API_URL}/booking/create`, bookingData);
            setBookingDetails({
                bookingId: res.data.bookingId,
                amount: res.data.amount,
            });
        } catch (err) {
            console.error(err);
            showNotification("Booking failed. Please try again.", "error");
            setFetchError(`Booking failed: ${err.response?.data?.message || 'Server error'}`);
        } finally {
            setLoading(false);
        }
    };

    // Payment success flow
    const handlePaymentSuccess = async (paymentResponseData) => {
        console.log('Payment Successful! Confirming your booking status...');
        setLoading(true);
        try {
            await axios.put(`${API_URL}/booking/confirm/${bookingDetails.bookingId}`, {
                paymentIntentId: paymentResponseData?.paymentIntentId,
            });

            // Confirmed successfully
            setBookedSlots((prev) => [...prev, selectedSlot]);
            showNotification("Payment successful", "success");
        } catch (err) {
            console.error('Error confirming booking:', err);
            showNotification("Payment succeeded but booking confirmation failed", "error");
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
                    onSuccess={handlePaymentSuccess}
                />
            </div>
        );
    }

    return (
        <div className="hall-picker-grid">
            {/* Floating Notification */}
            {notification && (
                <div className={`floating-notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            {/* Hall Selection */}
            <div className="hall-list">
                <h4 className="hall-picker-title">Select Hall</h4>
                {loading && <p>Loading halls...</p>}
                {!loading && fetchError && <p className="error-message">{fetchError}</p>}
                {!loading && !fetchError && halls.length === 0 && (
                    <p className="error-message">No halls found in this area.</p>
                )}
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

            {/* Date and Slot Picker */}
            <div>
                {selectedHall ? (
                    <div className="slot-hall-details">
                        <h4 className="hall-picker-title">
                            Choose Date & Slot for <b>{selectedHall.hallName}</b>
                        </h4>

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

                        <div className="slot-selector-grid">
                            {SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    disabled={isSlotBooked(slot)}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`slot-button ${
                                        isSlotBooked(slot)
                                            ? 'booked'
                                            : selectedSlot === slot
                                            ? 'selected'
                                            : 'available'
                                    }`}
                                >
                                    {slot}
                                    {isSlotBooked(slot) && (
                                        <span className="slot-booked-text">Booked</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="booking-summary-actions">
                            {selectedSlot ? (
                                <div className="booking-summary-text">
                                    Selected: <b>{selectedDate}</b> at <b>{selectedSlot}</b>
                                </div>
                            ) : (
                                <p className="error-message">
                                    Please select a date and time slot to proceed.
                                </p>
                            )}

                            <button
                                onClick={handleProceedToPayment}
                                disabled={!selectedHall || !selectedDate || !selectedSlot || loading}
                                className="proceed-button"
                            >
                                {loading
                                    ? 'Initiating Booking...'
                                    : `Proceed to Pay ₹${
                                          selectedHall.pricePerDay?.toLocaleString('en-IN') ||
                                          '10,000'
                                      }`}
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
