import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// CEO ADMIN ONLY
router.get("/", protect, allowRoles("CEO"), getNotifications);
router.put("/read/:id", protect, allowRoles("CEO"), markAsRead);
router.put("/read-all", protect, allowRoles("CEO"), markAllAsRead);
router.delete("/:id", protect, allowRoles("CEO"), deleteNotification);
router.put("/read-all", protect, allowRoles("CEO"), markAllAsRead);

export default router;
