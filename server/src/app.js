import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { createDefaultCEO } from "./config/initAdmin.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import path from "path";

connectDB();
createDefaultCEO();

const app = express();

const __dirname = path.resolve();
app.use("/bills", express.static(path.join(__dirname, "src/uploads/bills")));

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MAKE PDF & UPLOAD FOLDER ACCESSIBLE
app.use("/uploads", express.static("src/uploads"));

// LOGGER (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// REGISTER API ROUTES (clean order)
app.use("/api/auth", authRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("src/uploads"));
const billsPath = path.resolve("src/uploads/bills");
app.use("/uploads/bills", express.static(billsPath));

// ROOT TEST ROUTE
app.get("/", (req, res) => res.send("Server running ✔"));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
