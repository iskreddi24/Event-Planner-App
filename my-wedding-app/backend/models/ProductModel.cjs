const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: String, 
  availableInTelangana: { type: Boolean, default: true },
});
module.exports = mongoose.model("Product", ProductSchema);
