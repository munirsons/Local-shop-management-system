import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addProduct, getAllProducts, searchProducts,updateProduct,deleteProduct } from "../controllers/productController.js";
import { upload } from "../utils/upload.js";
import { allowRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post("/add", protect, upload.array("images", 4), addProduct);
router.get("/", protect, getAllProducts);
router.get("/search", protect, searchProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.post("/add", protect, allowRoles("CEO", "Manager"), addProduct);


export default router;
