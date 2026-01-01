import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { decrypt } from "../utils/encryption.js";
import { notify } from "../utils/notification.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const decryptedPassword = decrypt(user.encrypted_password);
    if (password !== decryptedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.designation !== "CEO") {
      await notify({
        message: `${user.username} logged in`,
        type: "AUTH",
        created_by: user.user_id,
        user_id: user.user_id
      });
    }

    const token = jwt.sign(
      { id: user._id, designation: user.designation },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        username: user.username,
        user_id: user.user_id,
        designation: user.designation
      }
    });

  } catch (err) {
    console.log("Login error:", err.message);
    return res.status(500).json({ message: "Auth failed" });
  }
};
