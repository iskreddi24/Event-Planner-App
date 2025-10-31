const mongoose = require("mongoose");


const exclusiveServiceSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, 
  serviceType: { type: String, required: true },
  date: { type: String }, 
  targetPerson: { type: String },
  serviceLocation: { type: String },
  goldWeight: { type: Number },
  rentalDurationDays: { type: Number },
  budget: { type: Number },
  message: { type: String },
  userId: { 
    type: String,
    required: true
  }, 
  status: { type: String, default: "Pending" }
},{ timestamps: true });

module.exports = mongoose.model("ExclusiveService", exclusiveServiceSchema);