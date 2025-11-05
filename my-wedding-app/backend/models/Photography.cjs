const mongoose = require('mongoose');

const photographySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    
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

    status: {
        type: String,
        enum: ['Pending', 'Contacted', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true 
});

const Photography = mongoose.model('Photography', photographySchema);
module.exports = Photography;
