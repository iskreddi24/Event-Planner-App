const mongoose = require('mongoose');

const photographySchema = new mongoose.Schema({
    // Link to the user who made the booking
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true
    },
    
    // User Contact Information
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },

    // Service Details
    eventType: {
        type: String,
        required: true,
        enum: ['Wedding', 'Birthday', 'Anniversary', 'Corporate', 'Other']
    },
    packageType: {
        type: String,
        required: true,
        enum: ['Standard', 'Premium', 'Platinum']
    },
    durationHours: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: Number,
        default: 0
    },
    message: {
        type: String,
        default: ''
    },

    // Admin/Status Tracking
    status: {
        type: String,
        enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Photography = mongoose.model('Photography', photographySchema);
module.exports = Photography;
