const express = require('express');
const router = express.Router();
const VIPBooking = require('../models/VIPBookingModel.cjs');
const { protect, admin } = require('../middleware/authMiddleware.cjs');

// 🔐 POST /api/vip/book
// User submits a VIP booking request
// vipRoutes.cjs
// ...

// 🔐 POST /api/vip/book
// User submits a VIP booking request
router.post('/book', protect, async (req, res) => {
    try {
        const {
            weddingDate,
            city,
            guestCount,
            totalBudget,
            selectedVenue,
            requiredServices
        } = req.body;

        if (!weddingDate || !city || !guestCount || !totalBudget || !selectedVenue?.name) {
            return res.status(400).json({ message: 'Missing required booking details.' });
        }

        let vipBooking = await VIPBooking.create({ // Use 'let' for reassignment
            userId: req.user._id,
            weddingDate,
            city,
            guestCount,
            totalBudget,
            selectedVenue,
            requiredServices: requiredServices || {}
        });
        
        // 🆕 Ensure the document is fully populated for the admin dashboard
        // We reassign the populated result to vipBooking.
        vipBooking = await vipBooking.populate('userId', 'name email');


        // Emit to all connected admins via socket.io (real-time update)
        if (req.io) {
            // Emit the fully populated document
            req.io.emit("vipBookingAdded", vipBooking);
        }

        res.status(201).json({
            success: true,
            message: 'VIP booking submitted successfully!',
            booking: vipBooking // Send the populated booking back
        });
    } catch (error) {
        console.error("Error creating VIP booking:", error); // Check your backend console for the detailed error here!
        res.status(500).json({ message: 'Server error during VIP booking creation.' });
    }
});

// ... (rest of the file remains the same)

// 👑 GET /api/vip
// Admin fetches all VIP bookings
router.get('/', protect, admin, async (req, res) => {
    try {
        const vipBookings = await VIPBooking.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(vipBookings);
    } catch (error) {
        console.error("Error fetching VIP bookings:", error);
        res.status(500).json({ message: 'Failed to retrieve VIP bookings.' });
    }
});

// 👑 PUT /api/vip/:id/status
// Admin updates booking status
router.put('/:id/status', protect, admin, async (req, res) => {
    const { status, finalQuotedAmount, paymentStatus } = req.body;

    try {
        const booking = await VIPBooking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (status) booking.status = status;
        if (finalQuotedAmount !== undefined) booking.finalQuotedAmount = finalQuotedAmount;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        // Real-time update
        if (req.io) {
            req.io.emit("vipBookingUpdated", booking);
        }

        res.json({ success: true, message: "Booking updated successfully", data: booking });
    } catch (error) {
        console.error("Error updating VIP status:", error);
        res.status(500).json({ message: 'Error updating booking status.' });
    }
});
// 🧾 GET /api/vip/bookings/:userId
// Fetch all VIP bookings for a specific user (User Dashboard)
router.get('/bookings/:userId', protect, async (req, res) => {
  try {
    const loggedInId = req.user.id || req.user._id; // Safe ID reference
    const { userId } = req.params;

    // ✅ Only allow viewing your own bookings (unless admin)
    if (loggedInId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these bookings.' });
    }

    const userBookings = await VIPBooking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json(userBookings);
  } catch (error) {
    console.error('Error fetching user VIP bookings:', error);
    res.status(500).json({ message: 'Failed to fetch user VIP bookings.' });
  }
});


module.exports = router;