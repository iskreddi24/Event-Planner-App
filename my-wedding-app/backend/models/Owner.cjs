const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    location: String, 
    hallName: String,
    capacity: Number,
    pricePerDay: Number,
});

module.exports = mongoose.model('Owner', ownerSchema);
