const mongoose = require('mongoose');

const functionHallSchema = new mongoose.Schema({
    // Link to the owner who registered this hall
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Owner' 
    },
    hallName: {
        type: String,
        required: true,
        trim: true
    },
    location: { 
        type: String,
        required: true,
        trim: true
    },
    area: { 
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerDay: {
        type: Number,
        required: true,
        min: 1000 
    },
    amenities: {
        type: [String],
        default: ['AC', 'Parking', 'Seating']
    },
    images: {
        type: [String],
        default: ['/hall-default.jpg']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FunctionHall', functionHallSchema);
