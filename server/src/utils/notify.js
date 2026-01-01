import Notification from "../models/Notification.js";

export const notify = async (data) => {
  try {
    await Notification.create(data); 
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};
