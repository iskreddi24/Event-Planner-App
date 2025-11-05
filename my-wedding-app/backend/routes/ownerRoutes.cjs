const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner.cjs');
const FunctionHall = require('../models/FunctionHall.cjs');
const Booking = require('../models/Booking.cjs'); // Need Booking model for confirmed bookings

router.post('/signup', async (req, res) => {
    try {
        const existingOwner = await Owner.findOne({ email: req.body.email });
        if (existingOwner) {
             return res.status(400).json({ message: 'Email already registered.' });
        }
        
        const newOwner = new Owner(req.body);
        await newOwner.save();

        const { hallName, location, area, capacity, pricePerDay } = req.body;
        const newHall = new FunctionHall({
            ownerId: newOwner._id, 
            hallName,
            location,
            area,
            capacity: Number(capacity),
            pricePerDay: Number(pricePerDay),
            isAvailable: true 
        });
        await newHall.save();

        res.status(201).json({ message: 'Registration and Hall setup successful! Please log in.' });
    } catch (err) {
        console.error('Owner Signup Error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        res.status(500).json({ error: 'Failed to complete registration and hall setup.', details: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email, password });
    if (!owner) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', owner, token: 'owner_jwt_placeholder' });
});

router.get('/hall/:ownerId', /* authMiddleware, */ async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const hall = await FunctionHall.findOne({ ownerId: ownerId }); 

        if (!hall) {
            return res.status(404).json({ message: 'No Function Hall found for this owner ID.' });
        }
        res.status(200).json(hall);
    } catch (error) {
        console.error('Backend Error fetching hall by owner ID:', error);
        res.status(500).json({ message: 'Server error fetching hall data.' });
    }
});

router.get('/bookings/:hallId', /* authMiddleware, */ async (req, res) => {
    try {
        const hallId = req.params.hallId;
        const confirmedBookings = await Booking.find({ 
            hall: hallId,
            status: 'Confirmed'
        }).populate('user', 'name email'); 

        res.status(200).json(confirmedBookings);
    } catch (error) {
        console.error('Backend Error fetching confirmed bookings:', error);
        res.status(500).json({ message: 'Server error fetching bookings.' });
    }
});

router.put('/hall/:hallId', /* authMiddleware, */ async (req, res) => {
    try {
        const hallId = req.params.hallId;
        const updates = req.body;

        const updatedHall = await FunctionHall.findByIdAndUpdate(
            hallId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!updatedHall) {
            return res.status(404).json({ message: 'Hall not found.' });
        }
        res.status(200).json(updatedHall);
    } catch (error) {
        console.error('Backend Error updating hall:', error);
        res.status(500).json({ message: 'Server error updating hall details.' });
    }
});


module.exports = router;
