const express = require("express");
const router = express.Router();
const Photography = require("../models/Photography.cjs");
const { protect, admin } = require("../middleware/authMiddleware.cjs");

// ✅ Utility: safely get userId from req.user
const getUserId = (req) => req.user?.id || req.user?._id;

// @route POST /api/photography
// @desc Create a new photoshoot booking
// @access Private (Requires user login)
router.post("/", protect, async (req, res) => {
  const {
    userId,
    userName,
    email,
    phone,
    eventType,
    packageType,
    durationHours,
    date,
    location,
    budget,
    message,
  } = req.body;

 

  const verifiedUserId = getUserId(req);

  if (
    !verifiedUserId ||
    !userName ||
    !email ||
    !phone ||
    !eventType ||
    !packageType ||
    !date ||
    !location
  ) {
    return res
      .status(400)
      .json({ message: "Please include all required fields." });
  }

  try {
    const newBooking = new Photography({
      userId: verifiedUserId,
      userName,
      email,
      phone,
      eventType,
      packageType,
      durationHours,
      date,
      location,
      budget,
      message,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating photography booking:", error);
    res.status(500).json({ message: "Server error during booking creation." });
  }
});

router.get("/user/:userId", protect, async (req, res) => {
  try {
    const uid = getUserId(req);
    if (!uid) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    if (uid.toString() !== req.params.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view these bookings." });
    }

    const bookings = await Photography.find({ userId: req.params.userId }).sort(
      { date: -1 }
    );

    console.log(` Found ${bookings.length} bookings for user ${uid}`);
    res.json(bookings);
  } catch (error) {
    console.error(" Error fetching user photography bookings:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching bookings." });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const bookings = await Photography.find().sort({ date: 1 });
    console.log(`📷 Admin fetched ${bookings.length} total bookings`);
    res.json(bookings);
  } catch (error) {
    console.error(
      "Error fetching all photography bookings for admin:",
      error
    );
    res
      .status(500)
      .json({ message: "Server error while fetching admin data." });
  }
});
router.put("/:id/status", protect, admin, async (req, res) => {
  const { status } = req.body;

  if (
    !status ||
    !["Pending", "Contacted", "Confirmed", "Cancelled", "Completed"].includes(
      status
    )
  ) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const updatedBooking = await Photography.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    console.log(` Booking ${req.params.id} updated to status: ${status}`);
    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating photography booking status:", error);
    res.status(500).json({ message: "Server error during status update." });
  }
});

module.exports = router;
