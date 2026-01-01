import React, { useState, useContext } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import SidebarToggle from "../components/SidebarToggle";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function AddProduct() {
  const [item_id, setItemId] = useState("");
  const [name, setName] = useState("");
  const [size_type, setSizeType] = useState("");
  const [customSize, setCustomSize] = useState(""); // For OTHER input
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [imageInputs, setImageInputs] = useState([""]);

  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!item_id.trim() || !name.trim()) {
      return alert("Item ID & Product Name are required!");
    }

    let finalSize = size_type === "Other" ? customSize : size_type;
    if (!finalSize.trim()) return alert("Please select size/type!");

    const finalImages = imageInputs.filter((url) => url.trim() !== "");

    const payload = {
      item_id,
      name,
      size_type: finalSize,
      quantity,
      price,
      images: finalImages,
    };

    try {
      await api.post("/products/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product Added Successfully!");

      setItemId("");
      setName("");
      setSizeType("");
      setCustomSize("");
      setQuantity(1);
      setPrice(0);
      setImageInputs([""]);
    } catch (err) {
      console.error("PRODUCT ERROR:", err.response?.data || err.message);
      alert("Failed to add product!");
    }
  };

  const addImageField = () => {
    if (imageInputs.length < 4) {
      setImageInputs([...imageInputs, ""]);
    }
  };

  const removeImageField = (index) => {
    const updated = [...imageInputs];
    updated.splice(index, 1);
    setImageInputs(updated);
  };

  return (
    <>
      <Navbar
              user={user}
              onLogout={() => {
                logout();
                navigate("/");
              }}
              onMenuClick={() => setSidebarOpen(true)}
            />
      <SidebarToggle onClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="container mt-5 text-white">
        <h2 className="text-center fw-bold">Add New Product</h2>

        <div className="card p-4 mt-4 bg-dark ">
          <input
            className="form-control mb-3 text-dark"
            placeholder="Item ID"
            value={item_id}
            onChange={(e) => setItemId(e.target.value)}
          />

          <input
            className="form-control mb-3 text-dark"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Size Type Dropdown */}
          <select
            className="form-control mb-3 text-dark"
            value={size_type}
            onChange={(e) => setSizeType(e.target.value)}
          >
            <option value="">Select Size / Type</option>
            <option value="Piece">Piece</option>
            <option value="Kg">Kg</option>
            <option value="Litre">Litre</option>
            <option value="Pack">Pack</option>
            <option value="Other">Other</option>
          </select>

          {/* Custom size/text when other selected */}
          {size_type === "Other" && (
            <input
              className="form-control mb-3 text-dark"
              placeholder="Enter custom size/type"
              maxLength={100}
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
            />
          )}

          {/* Quantity */}
          <div className="d-flex gap-2 mb-3 align-items-center">
            <button
              className="btn btn-secondary"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </button>
            <input
              className="form-control text-center text-dark"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ maxWidth: "80px" }}
            />
            <button
              className="btn btn-success"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Price */}
          <input
            className="form-control mb-3 text-dark"
            type="number"
            placeholder="Price (PKR)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <h6>Add Images URLs:</h6>
          {imageInputs.map((url, index) => (
            <div key={index} className="mb-3">
              <input
                className="form-control text-dark"
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                  const updated = [...imageInputs];
                  updated[index] = e.target.value;
                  setImageInputs(updated);
                }}
              />

              {url && (
                <img
                  src={url}
                  alt="preview"
                  className="mt-2"
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #333",
                  }}
                />
              )}

              {imageInputs.length > 1 && (
                <button
                  className="btn btn-danger btn-sm mt-1"
                  onClick={() => removeImageField(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {imageInputs.length < 4 && (
            <button
              className="btn btn-warning btn-sm mb-3"
              onClick={addImageField}
            >
              ➕ Add Another Image
            </button>
          )}

          <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
            ✓ Add Product
          </button>
        </div>
      </div>
    </>
  );
}
