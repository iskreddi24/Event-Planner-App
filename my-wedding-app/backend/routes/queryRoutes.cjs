const express = require("express");
const router = express.Router();
const Query = require("../models/queryModel.cjs");

router.post("/", async (req, res) => {
  try {
    const { userId, name, message } = req.body; 
    
    if (!userId || !name || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = new Query({ userId, name, message });
    await query.save();

    res.status(201).json({ message: "Query submitted successfully" });
  } catch (err) {
    console.error("POST /api/queries error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("GET /api/queries error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;