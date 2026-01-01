import Product from "../models/Product.js";


// ====================== ADD PRODUCT ======================
export const addProduct = async (req, res) => {
  try {
    let { item_id, name, size_type, quantity, price, images } = req.body;

    if (!item_id || !name || !size_type || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(images)) images = [];

    const product = new Product({
      item_id,
      name,
      size_type,
      quantity: Number(quantity),
      price: Number(price),
      images
    });

    await product.save();
    
    return res.status(201).json({ message: "Product added successfully!" });

  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({ message: err.message || "Server Error" });
  }
};


// ====================== GET ALL ======================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ====================== SEARCH ======================
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      name: { $regex: q, $options: "i" }
    });
    res.json(products);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ====================== UPDATE ======================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Product.findOneAndUpdate(
      { item_id: id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updated });

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};




// ====================== DELETE ======================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({ item_id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

