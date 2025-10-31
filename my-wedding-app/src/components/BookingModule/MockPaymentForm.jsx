import React, { useState } from 'react';
import axios from 'axios';
// 🔑 FIX: Reverting to two-level traversal as that is the common convention for src/styles
import "../../styles/bookingStyles.css";

// Assuming API_URL is defined and available from the shared environment context
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function MockPaymentForm({ bookingId, amount, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [mockError, setMockError] = useState(null);

    const handleMockSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMockError(null);

        // Simulate a successful payment transaction ID
        const mockIntentId = `pi_mock_${Math.random().toString(36).substring(2, 15)}`;

        try {
            // CRITICAL: Call the backend PUT endpoint to confirm the booking status (status: Confirmed)
            await axios.put(`${API_URL}/booking/confirm/${bookingId}`, {
                paymentIntentId: mockIntentId
            });

            // If successful, call the parent's onSuccess handler, 
            // which updates the bookedSlots state in SlotAndHallPicker.
            onSuccess({ id: mockIntentId, status: 'succeeded' });

        } catch (err) {
            console.error("Mock Confirmation Error:", err);
            // Display error returned from the backend (if the PUT request fails)
            setMockError(err.response?.data?.message || 'Mock confirmation failed on server. Check backend logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleMockSubmit} className="checkout-form mock-form">
            <div className="payment-amount">Total Amount: <span>₹{amount?.toLocaleString('en-IN')}</span></div>

            {mockError && <div className="payment-error error-message">{mockError}</div>}

            <button
                type="submit"
                disabled={loading}
                className="payment-button mock-button"
            >
                {loading ? 'Confirming Booking...' : `Confirm Mock Payment of ₹${amount?.toLocaleString('en-IN')}`}
            </button>
            <p className="mock-warning">Note: This button simulates success and sends the booking to the Owner Dashboard.</p>
        </form>
    );
}
