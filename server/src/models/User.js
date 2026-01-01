import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  user_id: { type: String, required: true, unique: true },
  encrypted_password: { type: String, required: true },
  designation: {
    type: String,
    enum: ["CEO", "Manager", "Seller"],
    default: "Seller",
  },
});;

export default mongoose.model("User", userSchema);
