const express = require("express");
const router = express.Router();
const ExclusiveService = require("../models/exclusiveServiceModel.cjs");

// ✅ POST: Create a new exclusive service booking
router.post("/", async (req, res) => {
    try {
        console.log("📦 Received data:", req.body);

        const newService = new ExclusiveService(req.body);
        await newService.save();

        res.status(201).json({ message: "Booking created successfully!" });
    } catch (error) {
        console.error("❌ Error creating booking:", error.message);
        res.status(500).json({ message: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const services = await ExclusiveService.find();
        res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Failed to fetch services" });
    }
});
router.get("/user/:id", async (req, res) => {
    try {
        const bookings = await ExclusiveService.find({ userId: req.params.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err.message });
    }
});


module.exports = router;
