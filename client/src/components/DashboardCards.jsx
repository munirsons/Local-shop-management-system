import React from "react";
import { useNavigate } from "react-router-dom";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const cardData = [
  {
    title: "Add Product",
    desc: "Add new stock to inventory",
    icon: <AddShoppingCartIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/add-product",
    bg: "#007BFF",
  },
  {
    title: "Sell Items",
    desc: "Process customer purchase",
    icon: <StoreIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/sell",
    bg: "#00A86B",
  },
  {
    title: "Manage Products",
    desc: "Update or delete inventory",
    icon: <EditIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/manage-products",
    bg: "#FFB800",
  },
  {
    title: "Bill History",
    desc: "View invoice records",
    icon: <ReceiptLongIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/history",
    bg: "#1E1E1E",
  },
  {
    title: "Manage Users",
    desc: "Create or delete users",
    icon: <GroupIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/users",
    bg: "#00B7C3",
  },
  {
    title: "Notifications",
    desc: "Track system updates",
    icon: <NotificationsActiveIcon style={{ fontSize: "40px", color: "#fff" }} />,
    route: "/notifications",
    bg: "#8A8A8A",
  },
];

export default function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 text-light" style={{ minHeight: "74vh" }}>
      <h1 className="text-center mb-3 fw-bold">Dashboard</h1>
      <h3 className="text-center mb-5 opacity-110">
        Select an option below to continue
      </h3>

      <div className="row g-4 justify-content-center">
        {cardData.map((card, i) => (
          <div key={i} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div
              className="p-4 text-white shadow-lg"
              style={{
                background: card.bg,
                borderRadius: "14px",
                minHeight: "160px",
                cursor: "pointer",
                transition: "all .25s ease-in-out",
              }}
              onClick={() => navigate(card.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              <div className="mb-2">{card.icon}</div>
              <h4 className="fw-bold">{card.title}</h4>
              <small className="opacity-75">{card.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
