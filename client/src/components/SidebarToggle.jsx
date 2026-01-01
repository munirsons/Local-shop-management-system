import React from "react";

export default function SidebarToggle({ onClick }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{
        position: "fixed",
        top: "80px",
        left: "20px",
        fontSize: "32px",
        background: "transparent",
        color: "white",
        border: "none",
        zIndex: 1500,
        cursor: "pointer",
      }}
    >
      ☰
    </button>
  );
}
