import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <DashboardCards />
    </>
  );
}
