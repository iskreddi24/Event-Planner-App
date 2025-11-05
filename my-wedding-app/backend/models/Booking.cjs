
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FunctionHall'
    },
    eventType: {
        type: String,
        required: true,
        enum: ['Wedding', 'Birthday Party', 'Anniversary', 'Half Saree']
    },
    date: {
        type: String, 
        required: true
    },
    timeSlot: {
        type: String,
        required: true,
        enum: ['Morning (9 AM - 2 PM)', 'Evening (5 PM - 10 PM)', 'Full Day']
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending_Payment',
        enum: ['Pending_Payment', 'Confirmed', 'Cancelled', 'Completed']
    },
    paymentIntentId: { // To track Stripe/Payment Gateway intent
        type: String,
        // Added validation: This must be present if the status is Confirmed
        required: function () {
            return this.status === 'Confirmed';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export using CommonJS module.exports
module.exports = mongoose.model('Booking', bookingSchema);