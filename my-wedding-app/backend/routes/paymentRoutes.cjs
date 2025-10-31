const express = require('express');
const router = express.Router();
// Assuming models are also using module.exports = mongoose.model(...)
const Booking = require('../models/Booking.cjs');
// Initialize Stripe library
const stripe = require('stripe');

// ⚠️ CRITICAL: REPLACE this placeholder with your actual STRIPE SECRET KEY (starts with sk_test_)
const secretKey = "sk_test_51P8glh007R7Q8h8gXF9fP7h8gXF9"; 

// Initialize Stripe client
const stripeClient = stripe(secretKey);

// --- API Endpoints ---

// 1. POST /api/payments/create-payment-intent
// Purpose: Creates a Payment Intent on Stripe's server.
router.post('/create-payment-intent', async (req, res) => {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid booking ID or amount.' });
    }

    // Stripe amount must be in the smallest currency unit (e.g., paise for INR)
    const paymentAmount = Math.round(amount * 100);

    try {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: paymentAmount,
            currency: 'inr',
            metadata: { integration_check: 'accept_a_payment', booking_id: bookingId },
        });

        // Send the client secret back to the frontend for payment confirmation
        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Stripe Error creating payment intent:', error);
        res.status(500).json({ error: error.message || 'Failed to create payment intent.' });
    }
});

// 2. POST /api/payments/confirm
// Purpose: Updates the booking status in your database after Stripe confirms success.
router.post('/confirm', async (req, res) => {
    const { bookingId, paymentIntentId } = req.body;

    if (!bookingId || !paymentIntentId) {
        return res.status(400).json({ message: 'Missing booking or payment intent ID.' });
    }

    try {
        // Find and update the booking status to Confirmed
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'Confirmed', paymentIntentId: paymentIntentId },
            { new: true } // returns the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Payment confirmed and booking updated.', booking: updatedBooking });

    } catch (error) {
        console.error('Error confirming payment and updating booking:', error);
        res.status(500).json({ message: 'Server error during payment confirmation.' });
    }
});

module.exports = router;
