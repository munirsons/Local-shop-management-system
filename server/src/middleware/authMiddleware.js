import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-encrypted_password");

    if (!req.user)
      return res.status(401).json({ message: "Invalid token" });

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// 🔥 ROLE Validation Middleware (missing earlier)
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.designation)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
