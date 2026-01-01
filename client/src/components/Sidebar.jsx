import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: isOpen ? "0" : "-240px",
        background: "#111",
        color: "#fff",
        transition: ".3s ease",
        paddingTop: "80px",
        zIndex: 2000,
        boxShadow: isOpen ? "4px 0 15px rgba(0,0,0,.4)" : "none",
      }}
    >
      <button
        className="btn btn-danger btn-sm ms-3"
        onClick={onClose}
      >
        Close
      </button>

      <ul className="list-unstyled mt-4 px-3">
        <li className="mb-3">
          <Link to="/add-product" className="text-white text-decoration-none">
            ➕ Add Product
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/manage-products" className="text-white text-decoration-none">
            ✏️ Manage Products
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/sell" className="text-white text-decoration-none">
            🛒 Sell Items
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/history" className="text-white text-decoration-none">
            📜 Bill History
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/users" className="text-white text-decoration-none">
            👥 Manage Users
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/notifications" className="text-white text-decoration-none">
            🔔 Notifications
          </Link>
        </li>
      </ul>
    </div>
  );
}
