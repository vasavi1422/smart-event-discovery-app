import mongoose from "mongoose";

// ✅ URL validation
const isValidURL = (v) => {
  if (!v) return true;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

const schema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    title: { 
      type: String, 
      required: [true, "Event title is required"], 
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },

    description: { 
      type: String, 
      required: [true, "Description is required"],
      minlength: [20, "Description should be at least 20 characters"]
    },

    event_type: { 
      type: String, 
      lowercase: true,
      enum: ["hackathon", "workshop", "seminar", "fest", "sports", "other"],
      default: "other",
      set: v => v === "" ? "other" : v
    },

    department: { type: String, trim: true },

    college: { 
      type: String, 
      required: true, 
      trim: true 
    },

    city: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // 🔹 Date & Time
    start_date: { 
      type: Date, 
      required: [true, "Start date is required"] 
    },

    end_date: { 
      type: Date 
    },

    time: { type: String },

    // 🔹 Media
    image_url: { 
      type: String, 
      default: "https://images.unsplash.com/photo-1540575861501-7ad060e39fe1?q=80&w=2070"
    },

    // 🔹 Links
    registration_link: { 
      type: String, 
      trim: true,
      validate: { validator: isValidURL, message: "Invalid URL" }
    },

    instagram_link: { 
      type: String, 
      trim: true,
      validate: { validator: isValidURL, message: "Invalid URL" }
    },

    youtube_link: { 
      type: String, 
      trim: true,
      validate: { validator: isValidURL, message: "Invalid URL" }
    },

    whatsapp_link: { 
      type: String, 
      trim: true,
      validate: { validator: isValidURL, message: "Invalid URL" }
    },

    // 🔹 Visibility
    visibility: {
      type: String,
      enum: ["public", "college", "department"],
      default: "public"
    },

    target_college: String,
    target_department: String,

    // 🔹 User Info
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    submitter_name: { type: String, required: true },

    submitter_email: { 
      type: String, 
      required: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"]
    },

    submitter_phone: { type: String, trim: true },

    // 🔹 Status
    is_verified_post: {
      type: Boolean,
      default: false
    },

    // 🔹 Search & Analytics
    tags: [{ type: String, trim: true, lowercase: true }],
    viewCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🔖 Bookmarks
    bookmarked_by: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // ⏳ TTL Auto-delete
    expiresAt: {
      type: Date,
      index: { expires: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔍 Search Index
schema.index({
  title: "text",
  college: "text",
  city: "text",
  tags: "text",
  department: "text"
});

// 🛠️ Middleware
schema.pre("save", function (next) {

  // ✅ Fix end_date
  if (!this.end_date) {
    this.end_date = this.start_date;
  }

  if (this.start_date > this.end_date) {
    return next(new Error("End date must be after start date"));
  }

  // ✅ TTL logic (1 day after event ends)
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (this.end_date) {
    this.expiresAt = new Date(this.end_date.getTime() + ONE_DAY);
  }

  next();
});

// ✨ Virtual: Expired
schema.virtual("is_expired").get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.end_date
    ? today > this.end_date
    : today > this.start_date;
});

// ✨ Virtual: formatted date
schema.virtual("formatted_date").get(function () {
  if (!this.start_date) return "TBA";

  return new Date(this.start_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
});

const Event = mongoose.model("Event", schema);
export default Event;