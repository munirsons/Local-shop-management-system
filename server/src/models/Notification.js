import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },

  // Expanded notification types
  type: {
    type: String,
    enum: ["USER", "STOCK", "BILL", "AUTH", "RESET_REQUEST"],
    default: "AUTH"
  },

  // Who performed the action (CEO001, USR-1234, SYSTEM)
  created_by: { type: String, default: "SYSTEM" },

  // Linking to a specific item/user/bill
  related_id: { type: String, default: null },

  // Individual or system notifications
  user_id: { type: String, default: null },

  is_read: { type: Boolean, default: false },

  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
