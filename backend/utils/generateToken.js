import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      college: user.college,
      department: user.department
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};