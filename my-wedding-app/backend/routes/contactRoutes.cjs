const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact.cjs");
const { protect, admin } = require("../middleware/authMiddleware.cjs");
const mongoose = require('mongoose');

router.post("/", protect, async (req, res) => {
    try {
        const { name, email, message, phone, eventType, eventDate, eventLocation, profession } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const newContact = new Contact({
            name,
            email,
            message,
            phone,
            eventType,
            eventDate,
            eventLocation,
            profession,
            userId: req.user.id, 
        });

        await newContact.save();
        res.status(201).json({ message: "Booking request submitted successfully!", newContact });
    } catch (error) {
        console.error("Error submitting booking:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Failed to submit booking." });
    }
});

router.get("/", protect, admin, async (req, res) => {
    try {
        console.log("✅ Admin fetching all contacts...");
        console.log("Admin user:", req.user);
        
        const contacts = await Contact.find().sort({ submittedAt: -1 }); // Use submittedAt instead of createdAt
        console.log("Fetched contacts count:", contacts.length);
        
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Failed to fetch bookings." });
    }
});

router.get("/my-bookings", protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const bookings = await Contact.find({ userId }).sort({ submittedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Failed to fetch user bookings." });
    }
});

router.put("/:id/status", protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'Contacted', 'Completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedBooking = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ message: "Booking status updated successfully!", updatedBooking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "Invalid booking ID format." });
        }
        res.status(500).json({ message: "Failed to update booking status." });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid booking ID format." });
        }

        const booking = await Contact.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this booking." });
        }

        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error("Error deleting booking:", error);
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "Invalid booking ID format." });
        }
        res.status(500).json({ message: "Failed to delete booking." });
    }
});

module.exports = router;