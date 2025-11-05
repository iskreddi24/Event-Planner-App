const mongoose = require('mongoose');

const VIPFunctionHallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        enum: ['Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Kolkata'], // Add cities as needed
    },
    capacity: {
        type: Number,
        required: true,
    },
    vipPrice: { // VIP Base Price (Admin-defined)
        type: Number,
        required: true,
    },
    // Optional details
    amenities: [String], 
    isExclusive: { // Hall only available to VIP clients
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('VIPFunctionHall', VIPFunctionHallSchema);
