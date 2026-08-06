import Bookmark from "../models/Bookmark.js";
import Event from "../models/Event.js";

// ✅ GET SAVED EVENTS
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookmarks = await Bookmark.find({ user: userId }).populate("event");

    const events = bookmarks.map((b) => b.event);

    res.json(events);
  } catch (err) {
    console.error("❌ GET BOOKMARKS:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADD BOOKMARK
export const addBookmark = async (req, res) => {
  try {
    const { eventId } = req.body;

    const exists = await Bookmark.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    await Bookmark.create({
      user: req.user._id,
      event: eventId,
    });

    res.json({ message: "Saved" });
  } catch (err) {
    console.error("❌ ADD BOOKMARK:", err);
    res.status(500).json({ message: "Error" });
  }
};

// ✅ REMOVE BOOKMARK
export const removeBookmark = async (req, res) => {
  try {
    const { eventId } = req.body;

    await Bookmark.findOneAndDelete({
      user: req.user._id,
      event: eventId,
    });

    res.json({ message: "Removed" });
  } catch (err) {
    console.error("❌ REMOVE BOOKMARK:", err);
    res.status(500).json({ message: "Error" });
  }
};