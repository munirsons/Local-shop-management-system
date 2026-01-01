import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    bill_no: { type: String, required: true, unique: true },

    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_address: { type: String, required: true },

    salesperson: { type: String, required: true },

    items: [
      {
        item_id: String,
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      }
    ],

    grand_total: { type: Number, required: true },
    payment_method: { type: String, required: true },
    pdf_path: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
