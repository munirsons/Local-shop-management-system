import Bill from "../models/Bill.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

let currentBill = [];

// ---------------- Add item to bill ----------------
export const addToBill = (req, res) => {
  const { item_id, name, price, quantity } = req.body;

  const idx = currentBill.findIndex(i => i.item_id === item_id);
  if (idx !== -1) {
    currentBill[idx].quantity += quantity;
    if (currentBill[idx].quantity <= 0) {
      currentBill.splice(idx, 1);
    }
  } else {
    currentBill.push({ item_id, name, price, quantity });
  }

  res.json(currentBill);
};

// ---------------- View Bill ----------------
export const viewBill = (req, res) => res.json(currentBill);

// ---------------- Remove item ----------------
export const removeFromBill = (req, res) => {
  const { item_id } = req.body;
  currentBill = currentBill.filter(i => i.item_id !== item_id);
  res.json(currentBill);
};

// ---------------- Print Bill ----------------
export const printBillAndUpdateStock = async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, payment_method, items } = req.body;

    if (!customer_name || !customer_phone || !customer_address)
      return res.status(400).json({ message: "Customer details missing!" });

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items added!" });

    const bill_no = "MS-" + Date.now();
    const itemsData = items.map(i => ({
      ...i,
      total: i.price * i.quantity
    }));
    const grand_total = itemsData.reduce((sum, i) => sum + i.total, 0);

    await Bill.create({
      bill_no,
      items: itemsData,
      grand_total,
      customer_name,
      customer_phone,
      customer_address,
      payment_method,
      salesperson: req.user.username
    });

    for (let item of itemsData) {
      await Product.updateOne(
        { item_id: item.item_id },
        { $inc: { quantity: -item.quantity } }
      );
    }

    const folder = path.resolve("src/uploads/bills");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const filePath = `${folder}/${bill_no}.pdf`;
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(filePath));

    // HEADER
    doc.fontSize(24).text("MS STORE", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).text("Phone: 0300-0000000 | Your Shop Address", { align: "center" });
    doc.moveDown(1);

    // CUSTOMER DETAILS
    doc.fontSize(12).text(`Invoice No: ${bill_no}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.text(`Salesperson: ${req.user.username}`);
    doc.text(`Payment: ${payment_method}`);
    doc.moveDown(1);

    doc.text(`Customer: ${customer_name}`);
    doc.text(`Phone: ${customer_phone}`);
    doc.text(`Address: ${customer_address}`);
    doc.moveDown(2);

    // TABLE HEADER
    doc.fontSize(13).text("Item", 40);
    doc.text("Qty", 250);
    doc.text("Price", 350);
    doc.text("Total", 450);
    doc.moveDown(0.2);

    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // TABLE ROWS
    itemsData.forEach(i => {
      doc.text(i.name, 40);
      doc.text(i.quantity.toString(), 250);
      doc.text(`PKR ${i.price}`, 350);
      doc.text(`PKR ${i.total}`, 450);
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
    doc.fontSize(16).text(`Total Payable: PKR ${grand_total}`, { align: "right" });

    doc.moveDown(2);
    doc.fontSize(11)
      .text(
        "Return Policy: Items can be returned/exchanged within 7 days of purchase with original receipt & unused condition.",
        { align: "center" }
      );

    doc.moveDown(1);
    doc.fontSize(12).text("Thank you for choosing MS Store ❤️", { align: "center" });

    doc.end();

    // Clear Current running bill
    currentBill = [];

    return res.json({
      success: true,
      message: "Bill generated successfully",
      pdf_path: `/bills/${bill_no}.pdf`
    });

  } catch (err) {
    console.log("\n❌ Bill Print Error:", err);
    return res.status(500).json({ message: "Error printing bill!" });
  }
  const savedBill = await Bill.create({
  bill_no,
  items: itemsData,
  grand_total,
  customer_name,
  customer_phone,
  customer_address,
  payment_method,
  salesperson: req.user.username,
  pdf_path: filePath.replace("src/", "")
});

};
