// storeRoutes.cjs
const express = require("express");
const Product = require("../models/ProductModel.cjs");
const Category = require("../models/CategoryModel.cjs");

const router = express.Router();

/* ------------------------- GET all products ------------------------- */
router.get("/products", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const items = await Product.find({})
      .populate("category", "name")
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ success: false, message: "Server error loading products" });
  }
});

/* ------------------------- GET categories ------------------------- */
router.get("/categories", async (req, res) => {
  try {
    const cats = await Category.find({}).sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error("❌ Error loading categories:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

/* ------------------------- POST add new product ------------------------- */
router.post("/products", async (req, res) => {
  try {
    const body = req.body;
    if (!body.category || body.category === "" || body.category === "undefined") {
      delete body.category;
    }

    const newProduct = new Product(body);
    await newProduct.save();

    const populated = await Product.findById(newProduct._id).populate("category", "name");

    // ✅ Emit real-time event to all connected clients
    if (req.io) req.io.emit("productAdded", populated);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(400).json({ success: false, message: err.message || "Invalid product data" });
  }
});

/* ------------------------- PUT update product ------------------------- */
router.put("/products/:id", async (req, res) => {
  try {
    const body = req.body;
    if (!body.category || body.category === "" || body.category === "undefined") {
      delete body.category;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("category", "name");

    if (!updated) return res.status(404).json({ message: "Product not found" });

    // ✅ Emit update event
    if (req.io) req.io.emit("productUpdated", updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ------------------------- DELETE product ------------------------- */
router.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    // ✅ Emit delete event
    if (req.io) req.io.emit("productDeleted", { id: req.params.id });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});
// Auto-add default wedding categories if not exist
router.get("/seed-categories", async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaults = [
        { name: "Bangles" },
        { name: "Makeup Kits" },
        { name: "Wedding Sarees" },
        { name: "Bridal Jewellery" },
        { name: "Decor Items" },
        { name: "Lighting Accessories" },
        { name: "Groom Attire" },
        { name: "Photography Gear" },
        { name: "Gift Hampers" },
        { name: "Puja Essentials" },
      ];
      await Category.insertMany(defaults);
      return res.json({ success: true, message: "Default categories added!", count: defaults.length });
    }
    res.json({ success: true, message: "Categories already exist" });
  } catch (err) {
    console.error("Error seeding categories:", err);
    res.status(500).json({ success: false, message: "Server error while seeding" });
  }
});

module.exports = router;
