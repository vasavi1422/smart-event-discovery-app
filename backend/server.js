import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import eventRoutes from "./routes/eventRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🌍 ENV fallback
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5000;

// 🔔 Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// 🔌 Socket Connection
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// 🔥 MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI missing in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`💥 DB Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// ==============================
// 🚀 ROUTES (ORDER MATTERS)
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ❌ 404 Handler (must be AFTER routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 💥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// 🚀 Start Server
server.listen(PORT, () => {
  console.log(`🔥 Server running on ${PORT}`);
});