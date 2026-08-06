import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ LOGIN / REGISTER
export const login = async (req, res) => {
  try {
    const { email, name } = req.body;

    // 🔴 Check email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 🔍 Find user
    let user = await User.findOne({ email });

    // 🆕 Create user if not exists
    if (!user) {
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        verified: email.endsWith(".edu") || email.endsWith(".ac.in")
      });
    }

    // 🔐 Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // ✅ Response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};