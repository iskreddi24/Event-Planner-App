const mongoose = require("mongoose");

// const exclusiveServiceSchema = new mongoose.Schema(
//   {
//     userName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     serviceType: { type: String, required: true },
//     date: { type: String, required: true },
//     location: { type: String, required: true },
//     message: { type: String },
//     status: { type: String, default: "Pending" }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ExclusiveService", exclusiveServiceSchema);
const exclusiveServiceSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceType: { type: String, required: true },
  dateRequired: { type: String }, // optional or required
  targetPerson: { type: String },
  serviceLocation: { type: String },
  goldWeight: { type: Number },
  rentalDurationDays: { type: Number },
  budget: { type: Number },
  message: { type: String },
  status: { type: String, default: "Pending" }
},{ timestamps: true });
module.exports = mongoose.model("ExclusiveService", exclusiveServiceSchema);
