const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

// --- 1. ENV LOAD ---
dotenv.config({ path: path.resolve(__dirname, ".env") });

// --- 2. SAFE MONGO URI FETCH ---
const getMongoUri = () => {
  if (process.env.MONGODB_CONNECTION_URI) {
    console.log("✅ Loaded MONGODB_CONNECTION_URI from env");
    return process.env.MONGODB_CONNECTION_URI;
  }
  try {
    const envFileContent = fs.readFileSync(path.resolve(__dirname, ".env"), "utf8");
    const match = envFileContent.match(/^MONGODB_CONNECTION_URI\s*=\s*(.+)$/m);
    if (match) return match[1].trim();
  } catch (e) {
    console.error("Error reading .env file:", e.message);
  }
  return undefined;
};

const MONGO_URI = getMongoUri();
if (!MONGO_URI) {
  console.error("❌ MongoDB URI missing in .env");
  process.exit(1);
}

// --- 3. EXPRESS APP ---
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// --- 4. CONNECT MONGODB ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// --- 5. IMPORT ROUTES ---
const authRoutes = require("./routes/authRoutes.cjs");
const contactRoutes = require("./routes/contactRoutes.cjs");
const exclusiveServiceRoutes = require("./routes/exclusiveServiceRoutes.cjs");
const decorationServiceRoute = require("./routes/decorationServiceRoute.cjs");
const queryRoutes = require("./routes/queryRoutes.cjs");
const photographyRoutes = require("./routes/photographyRoutes.cjs");
const reviewRoutes = require("./routes/reviewRoutes.cjs");
const ownerRoutes = require("./routes/ownerRoutes.cjs");
const bookingRoutes = require("./routes/bookingRoutes.cjs");
const vipRoutes = require("./routes/vipRoutes.cjs");
const vipManagementRoutes = require("./routes/vipManagementRoutes.cjs");
const messageRoutes = require("./routes/messageRoute.cjs");
const storeRoutes = require("./routes/storeRoutes.cjs");
const orderRoutes = require("./routes/orderRoutes.cjs");

// --- 6. HTTP SERVER + SOCKET.IO ---
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

// --- 7. INJECT SOCKET.IO INTO ROUTES ---
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- 8. REGISTER ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/exclusive", exclusiveServiceRoutes);
app.use("/api/decoration", decorationServiceRoute);
app.use("/api/queries", queryRoutes);
app.use("/api/photography", photographyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/vip", vipRoutes);
app.use("/api/vip/management", vipManagementRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/store", storeRoutes); // ✅ Store routes with real-time
app.use("/api/orders", orderRoutes);

// --- 9. BASIC ROUTES ---
app.get("/", (req, res) =>
  res.send("🎉 JUEYM Wedding App Backend (Realtime) is running!")
);
app.use((req, res) => res.status(404).send("<h1>404 - Route Not Found</h1>"));

// --- 10. SOCKET.IO EVENTS ---
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  /* ---------- VIP CHAT ---------- */
  socket.on("vipChatMessage", async (msg) => {
    io.emit("vipChatUpdate", msg);

    // 🔥 Persist chat in MongoDB
    try {
      const Message = require("./models/messageModel.cjs");
      await Message.create({
        userId: msg.userId || null,
        senderName: msg.sender || "Guest",
        text: msg.text,
      });
    } catch (err) {
      console.error("❌ Error saving chat message:", err.message);
    }
  });

  /* ---------- VIP FUNCTION HALL MANAGEMENT ---------- */
  socket.on("vipHallUpdated", (payload) => {
    io.emit("vipHallRealtimeUpdate", payload);
  });

  /* ---------- STORE REAL-TIME UPDATES ---------- */
  socket.on("productAdded", (data) => {
    console.log("🛒 Product added:", data.name);
    io.emit("productAdded", data);
  });

  socket.on("productUpdated", (data) => {
    console.log("♻️ Product updated:", data.name);
    io.emit("productUpdated", data);
  });

  socket.on("productDeleted", (data) => {
    console.log("🗑️ Product deleted:", data.id);
    io.emit("productDeleted", data);
  });

  /* ---------- DISCONNECT ---------- */
  socket.on("disconnect", () =>
    console.log("❌ Socket disconnected:", socket.id)
  );
});

// --- 11. START SERVER ---
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.IO at http://localhost:${PORT}`);
});
