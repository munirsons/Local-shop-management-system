import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { encrypt } from "./encryption.js";

dotenv.config();

const resetPassword = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const newEncryptedPassword = encrypt("admin123");

  const result = await User.findOneAndUpdate(
    { username: "admin" },
    { encrypted_password: newEncryptedPassword },
    { new: true }
  );

  console.log("Admin password reset successful ✔");
  console.log(result);

  mongoose.connection.close();
};

resetPassword();
