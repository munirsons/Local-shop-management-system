import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToBill, viewBill, removeFromBill, printBillAndUpdateStock } from "../controllers/billController.js";
import Bill from "../models/Bill.js";
const router = express.Router();

router.post("/add", protect, addToBill);
router.get("/view", protect, viewBill);
router.post("/remove", protect, removeFromBill);
router.post("/print", protect, printBillAndUpdateStock); // FIXED 🚀
router.get("/history", protect, async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch {
    res.status(500).json({ message: "Failed to load history" });
  }
});

export default router;