import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  item_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  size_type: { type: String, required: true }, // ⬅️ NEW FIELD ✔ REQUIRED
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  images: { type: [String], default: [] }, // multiple image URLs
}, {
  timestamps: true
});

export default mongoose.model("Product", productSchema);
