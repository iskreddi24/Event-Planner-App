const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner.cjs');
const FunctionHall = require('../models/FunctionHall.cjs');
const Booking = require('../models/Booking.cjs'); // Need Booking model for confirmed bookings

// --- 1. Owner Signup (Frontend calls /api/owner/signup) ---
router.post('/signup', async (req, res) => {
    try {
        const existingOwner = await Owner.findOne({ email: req.body.email });
        if (existingOwner) {
             return res.status(400).json({ message: 'Email already registered.' });
        }
        
        // 1. Create the new Owner user
        const newOwner = new Owner(req.body);
        await newOwner.save();

        // 2. Create the Function Hall entry, linking it to the new Owner's ID
        const { hallName, location, area, capacity, pricePerDay } = req.body;
        const newHall = new FunctionHall({
            // Assuming your Hall schema field is 'ownerId'
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

// --- 2. Owner Login (Frontend calls /api/owner/login) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email, password });
    if (!owner) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', owner, token: 'owner_jwt_placeholder' });
});


// --- 3. Owner Dashboard Data Fetch (Frontend calls /api/owner/hall/:ownerId) ---
// Now defined as /hall/:ownerId because the prefix is /api/owner
router.get('/hall/:ownerId', /* authMiddleware, */ async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        // Find the FunctionHall associated with this owner ID
        // Ensure this field ('ownerId' or whatever you use) matches your schema
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

// --- 4. Owner Dashboard Bookings Fetch (Frontend calls /api/owner/bookings/:hallId) ---
// Now defined as /bookings/:hallId because the prefix is /api/owner
router.get('/bookings/:hallId', /* authMiddleware, */ async (req, res) => {
    try {
        const hallId = req.params.hallId;
        // Fetch only CONFIRMED bookings for the hall
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

// --- 5. Owner Hall Update (Frontend calls /api/owner/hall/:hallId) ---
// Now defined as /hall/:hallId because the prefix is /api/owner
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
