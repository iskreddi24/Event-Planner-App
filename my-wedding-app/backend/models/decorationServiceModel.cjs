const mongoose = require("mongoose");

const decorationServiceSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true }, // Birthday, Anniversary, etc.
  theme: { type: String, required: false }, // Theme of decoration
  membersCount: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: false },
  message: { type: String },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("DecorationService", decorationServiceSchema);
