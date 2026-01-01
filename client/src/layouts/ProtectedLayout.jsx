import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarToggle from "../components/SidebarToggle";

export default function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

      {/* Sidebar Toggle + Sidebar for all pages except Dashboard */}
      <SidebarToggle onClick={toggleSidebar} visible={true} />
      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      {/* Main content shifts when sidebar is open */}
      <div className={`page-content ${sidebarOpen ? "content-shift" : ""}`}>
        {children}
      </div>
    </>
  );
}
