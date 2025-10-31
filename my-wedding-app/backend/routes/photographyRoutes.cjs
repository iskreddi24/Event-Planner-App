const express = require('express');
const router = express.Router();
// FIX: Corrected the path to navigate up one directory and into the models folder
const Photography = require('../models/Photography.cjs'); 
const { protect, admin } = require('../middleware/authMiddleware.cjs'); // Ensure path/extension is correct

// @route POST /api/photography
// @desc Create a new photoshoot booking
// @access Private (Requires user login)
router.post('/', protect, async (req, res) => {
    const { 
        userId, userName, email, phone, eventType, packageType, 
        durationHours, date, location, budget, message 
    } = req.body;

    // Basic validation
    if (!req.user.id || !userName || !email || !phone || !eventType || !packageType || !date || !location) {
        return res.status(400).json({ message: 'Please include all required fields.' });
    }

    try {
        const newBooking = new Photography({
            userId: req.user.id, // Use ID from validated token
            userName, email, phone, eventType, packageType, 
            durationHours, date, location, budget, message
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating photography booking:', error);
        res.status(500).json({ message: 'Server error during booking creation.' });
    }
});

// @route GET /api/photography/user/:userId
// @desc Get all bookings for a specific user (for their dashboard)
// @access Private (Requires user login)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        // Ensure user is fetching their own bookings or is an admin
        if (req.user.id.toString() !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these bookings.' });
        }
        
        const bookings = await Photography.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user photography bookings:', error);
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
});

// @route GET /api/photography (Admin route)
// @desc Get ALL photography bookings
// @access Private (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const bookings = await Photography.find().sort({ date: 1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching all photography bookings for admin:', error);
        res.status(500).json({ message: 'Server error while fetching admin data.' });
    }
});

// @route PUT /api/photography/:id/status (Admin route)
// @desc Update status of a photography booking
// @access Private (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status } = req.body;

    if (!status || !['Pending', 'Contacted', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const updatedBooking = await Photography.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.json(updatedBooking);
    } catch (error) {
        console.error('Error updating photography booking status:', error);
        res.status(500).json({ message: 'Server error during status update.' });
    }
});

module.exports = router;