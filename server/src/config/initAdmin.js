import User from "../models/User.js";
import { encrypt } from "../utils/encryption.js";

export const createDefaultCEO = async () => {
  const exists = await User.findOne({ username: "admin" });
  if (!exists) {
    await User.create({
      username: "admin",
      user_id: "CEO001",
      encrypted_password: encrypt("admin123"),
      designation: "CEO"
    });
    console.log("Default CEO Account Created ✔");
  }
};
