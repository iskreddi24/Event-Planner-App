const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.cjs');
const stripe = require('stripe');

const secretKey = "sk_test_51P8glh007R7Q8h8gXF9fP7h8gXF9"; 

const stripeClient = stripe(secretKey);

router.post('/create-payment-intent', async (req, res) => {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid booking ID or amount.' });
    }

    const paymentAmount = Math.round(amount * 100);

    try {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: paymentAmount,
            currency: 'inr',
            metadata: { integration_check: 'accept_a_payment', booking_id: bookingId },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Stripe Error creating payment intent:', error);
        res.status(500).json({ error: error.message || 'Failed to create payment intent.' });
    }
});

router.post('/confirm', async (req, res) => {
    const { bookingId, paymentIntentId } = req.body;

    if (!bookingId || !paymentIntentId) {
        return res.status(400).json({ message: 'Missing booking or payment intent ID.' });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'Confirmed', paymentIntentId: paymentIntentId },
            { new: true } 
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
