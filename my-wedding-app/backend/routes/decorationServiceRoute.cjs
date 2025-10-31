const express = require("express");
const router = express.Router();
const DecorationService = require("../models/decorationServiceModel.cjs");

router.post("/", async (req, res) => {
  try {
    const newDecoration = new DecorationService(req.body);
    await newDecoration.save();
    res.status(201).json({ message: "Decoration booking created successfully!" });
  } catch (err) {
    console.error("Error saving decoration booking:", err);
    res.status(500).json({ error: "Failed to save decoration booking." });
  }
});

router.get("/", async (req, res) => {
  try {
    const decorations = await DecorationService.find();
    res.json(decorations);
  } catch (err) {
    res.status(500).json({ error: "Error fetching decorations." });
  }
});
router.get("/", async (req, res) => {
  try {
    const bookings = await DecorationService.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
