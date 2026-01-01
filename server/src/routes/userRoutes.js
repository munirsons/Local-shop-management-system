import express from "express";
import { createUser, getUsers, deleteUser } from "../controllers/userController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
// import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", protect, allowRoles("CEO"), createUser);
router.get("/", protect, allowRoles("CEO"), getUsers);
router.delete("/:id", protect, allowRoles("CEO"), deleteUser);

export default router;
