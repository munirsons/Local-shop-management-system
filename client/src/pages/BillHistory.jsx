import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarToggle from "../components/SidebarToggle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function BillHistory() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

const token = localStorage.getItem("token");
const { user, logout } = useContext(AuthContext);
const navigate = useNavigate();
const [sidebarOpen, setSidebarOpen] = useState(false);


  const loadBills = useCallback(async () => {
    try {
      const res = await api.get("/bill/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBills(sorted);
      console.log("Loads Bills",res.data);
    } catch (err) {
      console.log("Bill Load Error:", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    loadBills();
    const toggle = () => setSidebarOpen((prev) => !prev);
    document.addEventListener("toggleSidebar", toggle);
    return () => document.removeEventListener("toggleSidebar", toggle);
  }, [loadBills]);

  const filteredBills = bills.filter((b) =>
  b.bill_no.toLowerCase().includes(search.toLowerCase()) ||
  (b.customer_name || "").toLowerCase().includes(search.toLowerCase())
);


  // const downloadPDF = (bill) => {
  //   if (!bill.pdf_path) return alert("PDF not found!");
  //   window.open(`/bills/$b.{bill_no}.pdf`);
  // };

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

      <div className={`container mt-5 text-light ${sidebarOpen ? "shifted" : ""}`}>
        <h2 className="fw-bold mb-4">Bill History</h2>

        <input
          className="form-control w-50 mb-3"
          placeholder="Search Bill No. / Customer Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-responsive rounded-3">
          <table className="table table-secondary  table-bordered text-center align-middle">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Customer</th>
                <th>Salesperson</th>
                <th>Total (PKR)</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredBills.map((b) => (
                <tr key={b._id}>
                  <td>{b.bill_no}</td>
                  <td>{b.customer_name || "N/A"}</td>
                  <td>{b.salesperson || "N/A"}</td>
                  <td className="fw-bold text-success">
                    {b.grand_total.toLocaleString()} PKR
                  </td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>

                </tr>
              ))}

              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted text-center py-3">
                    ❌ No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
