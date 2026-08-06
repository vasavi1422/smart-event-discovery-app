import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ GET all notifications (latest first)
router.get("/", async (req, res) => {
  try {
    const data = await Notification.find().sort({ created_at: -1 });
    res.json(data);
  } catch (err) {
    console.log("❌ FETCH NOTIFICATIONS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE notification (for testing / future use)
router.post("/", async (req, res) => {
  try {
    const { message, event_id } = req.body;

    const newNotification = await Notification.create({
      message,
      event_id
    });

    res.status(201).json(newNotification);
  } catch (err) {
    console.log("❌ CREATE NOTIFICATION ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;