import Notification from "../models/Notification.js";

export async function notify(data) {
  try {
    await Notification.create(data);
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
}