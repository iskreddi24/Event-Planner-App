const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{ product: String, quantity: Number, price: Number }],
  totalAmount: Number,
  address: String,
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
});
module.exports = mongoose.model("Order", OrderSchema);
