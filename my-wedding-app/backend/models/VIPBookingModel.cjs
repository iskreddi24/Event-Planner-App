const mongoose = require('mongoose');

const VIPBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    weddingDate: {
        type: Date,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    guestCount: {
        type: Number,
        required: true,
        min: 50
    },
    totalBudget: {
        type: Number,
        required: true
    },

    selectedVenue: {
        name: { type: String, required: true },
        vipPriceQuoted: { type: Number, default: 0 }
    },

    requiredServices: {
        photography: { type: Boolean, default: false },
        decoration: { type: Boolean, default: false },
        haldiTeam: { type: Boolean, default: false },
        decorationTheme: { type: String, default: "Standard Decor" },
        fullAssistance: { type: Boolean, default: true }
    },

    status: {
        type: String,
        enum: ['Pending Quote', 'Quote Sent', 'Booked', 'Completed', 'Cancelled'],
        default: 'Pending Quote'
    },
    finalQuotedAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Partial'],
        default: 'Pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VIPBooking', VIPBookingSchema);
