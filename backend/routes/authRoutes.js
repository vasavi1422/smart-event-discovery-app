import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

export const login = async (req, res) => {
  try {
    const { email, name } = req.body;

    // 1. Basic Validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2. Find or Create User (Matches your specific Schema)
    let user = await User.findOne({ email });

    if (!user) {
      console.log("🌱 New user detected. Registering...");
      user = await User.create({
        email,
        name: name || email.split("@")[0], // Extracts name from email if name is missing
        verified: email.endsWith(".edu") || email.endsWith(".ac.in") // Auto-verify campus emails
      });
    }

    // 3. Create a JWT Token
    // This allows the frontend to stay logged in
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Success Response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        verified: user.verified
      },
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Database error during login" });
  }
};

// This endpoint must match your frontend's API.post("/auth/login") call
router.post("/login", login);

export default router;