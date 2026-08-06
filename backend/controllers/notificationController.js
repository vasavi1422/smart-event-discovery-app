import Notification from "../models/Notification.js";

// ✅ GET all notifications (SAFE + CLEAN)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      .find()
      .sort({ createdAt: -1 })
      .lean(); // ✅ plain JS objects (safer for frontend)

    // ✅ ALWAYS return array (even if null)
    return res.status(200).json(
      Array.isArray(notifications) ? notifications : []
    );

  } catch (err) {
    console.log("❌ GET NOTIFICATIONS ERROR:", err.message);

    // ❗ return array even on error to prevent frontend crash
    return res.status(200).json([]);
  }
};


// ✅ CREATE notification (STRICT VALIDATION)
export const createNotification = async (req, res) => {
  try {
    const { title, message, eventId } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const newNotif = await Notification.create({
      title: title?.trim() || "Notification",
      message: message.trim(),
      eventId: eventId || null,
    });

    return res.status(201).json(newNotif);

  } catch (err) {
    console.log("❌ CREATE NOTIFICATION ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to create notification",
    });
  }
};