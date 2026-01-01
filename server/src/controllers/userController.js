import User from "../models/User.js";
import { encrypt } from "../utils/encryption.js";
import { notify } from "../utils/notify.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, designation } = req.body;

    if (!username || !password || !designation) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const encrypted_password = encrypt(password);
    const user_id = "USR-" + Date.now();

    const newUser = await User.create({
      username,
      encrypted_password,
      user_id,
      designation
    });

    // 🔥 Create Notification AFTER user is created & user_id exists
    await notify({
      message: `New User Created: ${user_id} (${designation})`,
      type: "USER",
      created_by: req.user?.user_id || "SYSTEM",
      related_id: user_id,
      user_id
    });

    return res.json({ message: "User Created ✔", user: newUser });

  } catch (err) {
    console.log("Create User Error:", err);
    return res.status(500).json({ message: "User creation failed" });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-encrypted_password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};