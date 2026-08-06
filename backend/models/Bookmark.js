import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }
});

export default mongoose.model("Bookmark", schema);