// const express = require("express");
// const router = express.Router();
// const Order = require("../models/OrderModel.cjs");
// const restrictTelangana = require("../middleware/restrictTelangana.cjs");
// const { protect } = require("../middleware/authMiddleware.cjs");

// router.post("/", auth, restrictTelangana, async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.json(order);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// router.get("/admin", auth, async (req, res) => {
//   const orders = await Order.find().populate("user");
//   res.json(orders);
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Order = require("../models/OrderModel.cjs");
const { protect } = require("../middleware/authMiddleware.cjs");

router.post("/create", protect, async (req, res) => {
  try {
    const newOrder = new Order({
      user: req.user._id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentStatus: "Pending",
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ message: "Error creating order" });
  }
});

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
