import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
// FIX: Using the correct path for the styles
import "../../styles/bookingStyles.css"; 
import MockPaymentForm from './MockPaymentForm.jsx'; // Import the mock component

// Environment variables are accessed directly here
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholderkey';
const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
// Determine if we should use the mock payment system
const USE_MOCK_PAYMENTS = import.meta.env.VITE_MOCK_PAYMENTS === 'true';

// Only load Stripe if we are not in mock mode
const stripePromise = USE_MOCK_PAYMENTS ? null : loadStripe(STRIPE_KEY);

function CheckoutForm({ bookingId, amount, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) return;

        try {
            // 1) Create payment intent on server
            const res = await axios.post(`${API_URL}/payments/create-payment-intent`, { bookingId, amount });
            const clientSecret = res.data.clientSecret;

            // 2) Confirm card payment
            const cardElement = elements.getElement(CardElement);
            const confirm = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (confirm.error) {
                setError(confirm.error.message);
                setLoading(false);
                return;
            }

            if (confirm.paymentIntent && confirm.paymentIntent.status === 'succeeded') {
                // 3) Notify backend to confirm booking status
                // We use PUT /api/booking/confirm/:bookingId
                await axios.put(`${API_URL}/booking/confirm/${bookingId}`, { paymentIntentId: confirm.paymentIntent.id });
                onSuccess(confirm.paymentIntent); // Pass transaction details back
            }

        } catch (err) {
            console.error(err);
            // Handling the case where the backend payment intent fails (like the 404 we fixed)
            setError(err.response?.data?.error || err.message || 'Payment failed. Check server logs.'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h5>Pay securely with card</h5>
            <div className="card-element-container">
                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
            {error && <div className="payment-error error-message">{error}</div>}

            <div className="payment-amount">Total Amount: <span>₹{amount?.toLocaleString('en-IN')}</span></div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className="payment-button"
            >
                {loading ? 'Processing Payment...' : `Confirm Payment of ₹${amount?.toLocaleString('en-IN')}`}
            </button>
        </form>
    );
}

// Main exported component that handles the switch
export default function StripePaymentPortal({ bookingId, amount, onSuccess }) {
    
    if (USE_MOCK_PAYMENTS) {
        return (
            <div className="payment-portal-container">
                <h4 className="payment-portal-title mock-title">Testing Gateway (MOCK MODE)</h4>
                <p className="payment-portal-info mock-warning">Payment is simulated for testing. No actual transaction will occur.</p>
                <MockPaymentForm bookingId={bookingId} amount={amount} onSuccess={onSuccess} />
            </div>
        );
    }

    if (!STRIPE_KEY || STRIPE_KEY === 'pk_test_placeholderkey') {
        return <p className="error-message">Payment system not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in .env.</p>
    }
    
    return (
        <Elements stripe={stripePromise}>
            <div className="payment-portal-container">
                <h4 className="payment-portal-title">Payment Gateway</h4>
                <p className="payment-portal-info">Finalizing your booking details...</p>
                <CheckoutForm bookingId={bookingId} amount={amount} onSuccess={onSuccess} />
            </div>
        </Elements>
    );
}
