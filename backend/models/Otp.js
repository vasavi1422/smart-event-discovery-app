import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
  verified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Otp", otpSchema);