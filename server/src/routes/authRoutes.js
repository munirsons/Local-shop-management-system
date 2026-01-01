import express from "express";
import { login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.post("/login", login);

export default router;


