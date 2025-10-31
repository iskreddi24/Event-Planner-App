const express = require('express');
const router = express.Router();
// Assuming models are also using module.exports = mongoose.model(...)
const Booking = require('../models/Booking.cjs');
const FunctionHall = require('../models/FunctionHall.cjs');

// --- NEW ROUTE: GET /locations ---
// Frontend Call: /api/booking/locations
router.get('/locations', async (req, res) => {
    try {
        // Use MongoDB aggregation to get unique locations and their areas
        const locationData = await FunctionHall.aggregate([
            {
                // Group by location and collect all unique areas for that location
                $group: {
                    _id: "$location",
                    areas: { $addToSet: "$area" }
                }
            },
            {
                // Project the output to match the frontend's expected format:
                // [{ location: 'State', areas: ['Area1', 'Area2'] }, ...]
                $project: {
                    _id: 0,
                    location: "$_id",
                    areas: "$areas"
                }
            },
            { $sort: { location: 1 } }
        ]);
        
        res.status(200).json(locationData);
    } catch (err) {
        console.error('Error fetching unique locations:', err);
        res.status(500).json({ message: 'Failed to fetch location data.' });
    }
});


// --- Existing Routes (must be defined relative to /api/booking) ---

// Frontend Call: GET /api/booking/halls?location=X&area=Y
router.get('/halls', async (req, res) => {
    const { location, area } = req.query;
    try {
        const halls = await FunctionHall.find({ location, area, isAvailable: true });
        res.status(200).json(halls);
    } catch (err) {
        console.error('Error fetching halls:', err);
        res.status(500).json({ message: 'Failed to fetch halls.', error: err.message });
    }
});

// Frontend Call: GET /api/booking/availability/:hallId/:date
router.get('/availability/:hallId/:date', async (req, res) => {
    const { hallId, date } = req.params;
    const normalizedDate = new Date(date).toISOString().split('T')[0];

    try {
        // Only block slots that are 'Confirmed'.
        const bookings = await Booking.find({
            hall: hallId,
            date: normalizedDate,
            status: 'Confirmed'
        });

        const bookedSlots = bookings.map(b => b.timeSlot);
        res.status(200).json({ hallId, date: normalizedDate, bookedSlots });
    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ message: 'Failed to check availability.', error: err.message });
    }
});

// Frontend Call: POST /api/booking/create
router.post('/create', async (req, res) => {
    const { user, hall, eventType, date, timeSlot, totalAmount } = req.body;

    try {
        const isSlotConfirmed = await Booking.findOne({
            hall: hall,
            date: date,
            timeSlot: timeSlot,
            status: 'Confirmed'
        });

        if (isSlotConfirmed) {
            return res.status(400).json({ message: 'Selected slot is confirmed and unavailable.' });
        }

        const newBooking = new Booking({
            user,
            hall,
            eventType,
            date,
            timeSlot,
            totalAmount,
            status: 'Pending_Payment' // Initial status
        });

        await newBooking.save();

        res.status(201).json({
            message: 'Booking initiated. Proceed to payment.',
            bookingId: newBooking._id,
            amount: newBooking.totalAmount
        });

    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ message: 'Failed to initiate booking.', error: err.message });
    }
});

// Frontend Call: PUT /api/booking/confirm/:bookingId
router.put('/confirm/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { paymentIntentId } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                status: 'Confirmed', 
                paymentIntentId: paymentIntentId 
            },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        res.status(200).json({ message: 'Booking successfully confirmed!', booking: updatedBooking });
    } catch (error) {
        console.error('Backend Error confirming booking:', error);
        res.status(500).json({ message: 'Failed to confirm booking status.', error: error.message });
    }
});


module.exports = router;
