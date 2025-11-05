const express = require("express");
const router = express.Router();
const Product = require("../models/ProductModel.cjs");
const Category = require("../models/CategoryModel.cjs");
const { protect, admin } = require("../middleware/authMiddleware.cjs"); // ✅ Correct import

// 🛒 Admin - Add Category
router.post("/category", protect, admin, async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🛍️ Admin - Add Product
router.post("/product", protect, admin, async (req, res) => {
  try {
    const prod = new Product(req.body);
    await prod.save();
    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👀 Get All Products (public route)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
