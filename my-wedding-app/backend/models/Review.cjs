const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: { type: String, required: true },
    service: {
        type: String,
        enum: ['Exclusive Services', 'Decoration Services', 'Photography Service', 'General'],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    photoUrl: { // Placeholder for storing a reference to an uploaded image
        type: String,
        default: ''
    },
    isSatisfied: {
        type: Boolean,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false // Requires admin approval before appearing publicly
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);