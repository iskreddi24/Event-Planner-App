const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    location: String, // State/Country (e.g., Andhra Pradesh)
    hallName: String,
    capacity: Number,
    pricePerDay: Number,
});

// Export using CommonJS module.exports
module.exports = mongoose.model('Owner', ownerSchema);
