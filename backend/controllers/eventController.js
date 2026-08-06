import Event from "../models/Event.js";
import Notification from "../models/Notification.js";

// ✅ Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Create a new event
export const createEvent = async (req, res) => {
    try {
        // 1. Save the event to MongoDB
        const newEvent = await Event.create(req.body);

        // 2. 🔔 Send the Real-Time Notification
        if (req.io) {
            // Modify this object to change what the user sees in the popup
            req.io.emit("notification", {
                _id: newEvent._id,
                title: newEvent.title,
                message: `📢 Alert: ${newEvent.title} has been posted!`, 
                type: "EVENT_CREATED",
                createdAt: new Date()
            });
        }

        // 3. 💾 (Optional) Save to Notification Collection
        // If you want a "History" tab for notifications, uncomment below:
        /*
        await Notification.create({
            message: `New event: ${newEvent.title}`,
            type: 'EVENT_CREATED',
            // recipient: ... (you'd need logic to target specific users here)
        });
        */

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};