import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { type } : {};

    const list = await Notification.find(filter).sort({ created_at: -1 });

    res.json(list);
  } catch (err) {
    console.log("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.log("Error marking notification:", err);
    res.status(500).json({ message: "Failed" });
  }
};


export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("Error deleting notification:", err);
    res.status(500).json({ message: "Failed" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { created_by: req.user.user_id },
      { $set: { is_read: true } }
    );
    res.json({ message: "All marked as read ✔" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all read" });
  }
};