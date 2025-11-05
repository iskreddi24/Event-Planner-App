const express = require('express');
const router = express.Router();
const VIPFunctionHall = require('../models/VIPFunctionHall.cjs');
const { protect, admin } = require('../middleware/authMiddleware.cjs');

// @desc    Admin: Add a new VIP Function Hall
// @route   POST /api/vip/management/halls
// @access  Private/Admin
router.post('/halls', protect, admin, async (req, res) => {
    try {
        const { name, city, capacity, vipPrice, amenities } = req.body;

        if (!name || !city || !capacity || !vipPrice) {
            return res.status(400).json({ message: 'Missing required fields for function hall.' });
        }

        const newHall = await VIPFunctionHall.create({
            name, city, capacity, vipPrice, amenities: amenities || [],
        });

        res.status(201).json({ success: true, data: newHall });
    } catch (error) {
        console.error("Error creating VIP hall:", error);
        res.status(500).json({ message: 'Server error creating VIP hall.' });
    }
});

// @desc    Get all VIP Function Halls (used by both Admin and Frontend)
// @route   GET /api/vip/management/halls
// @access  Public (or Protected, depending on preference, making public for the VIP page)
router.get('/halls', async (req, res) => {
    try {
        // Find halls, sort by city and name
        const halls = await VIPFunctionHall.find().sort({ city: 1, name: 1 });
        res.status(200).json(halls);
    } catch (error) {
        console.error("Error fetching VIP halls:", error);
        res.status(500).json({ message: 'Failed to retrieve VIP halls.' });
    }
});
router.post("/addHall", async (req, res) => {
  try {
    const hall = new Hall(req.body);
    await hall.save();

    const io = req.app.get("io");
    io.emit("vipHallAdded", hall);  // realtime broadcast

    res.json({ success: true, hall });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin: Delete a VIP Function Hall
// @route   DELETE /api/vip/management/halls/:id
// @access  Private/Admin
router.delete('/halls/:id', protect, admin, async (req, res) => {
    try {
        const hall = await VIPFunctionHall.findByIdAndDelete(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Function hall not found.' });
        }
        res.status(200).json({ success: true, message: 'Function hall deleted.' });
    } catch (error) {
        console.error("Error deleting VIP hall:", error);
        res.status(500).json({ message: 'Server error deleting VIP hall.' });
    }
});

module.exports = router;

