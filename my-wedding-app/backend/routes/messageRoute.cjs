const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel.cjs"); // new model for messages

router.post("/", async (req, res) => {
  try {
    const { userId, senderName, text } = req.body;

    if (!userId || !senderName || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = new Message({ userId, senderName, text });
    await message.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("POST /api/messages error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("GET /api/messages error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
