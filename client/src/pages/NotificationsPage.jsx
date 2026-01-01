import React, { useEffect, useState, useCallback, useContext } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";
import Navbar from "../components/Navbar";
import SidebarToggle from "../components/SidebarToggle";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NotificationsPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const res = await getNotifications(token);
    setList(res.data);
  }, [token]);

  const markAll = async () => {
    const unread = list.filter((n) => !n.is_read);
    await Promise.all(unread.map((n) => markAsRead(n._id, token)));
    load();
  };

  useEffect(() => {
    load();
  }, [load]);

  const displayed =
    filter === "UNREAD" ? list.filter((n) => !n.is_read) : list;

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

      <div className="container mt-5 text-light">
        <h3>Notifications</h3>

        <div className="d-flex gap-2 mb-3">
          <button
            className={`btn btn-sm ${
              filter === "ALL" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter("ALL")}
          >
            All
          </button>

          <button
            className={`btn btn-sm ${
              filter === "UNREAD" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() => setFilter("UNREAD")}
          >
            Unread
          </button>

          <button className="btn btn-sm btn-success" onClick={markAll}>
            Mark All Read
          </button>
        </div>

        {displayed.length === 0 && <p>No Records Found</p>}

        {displayed.map((n) => (
          <div
            key={n._id}
            className={`p-2 mb-2 border rounded ${
              n.is_read ? "" : "bg-warning"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => markAsRead(n._id, token).then(load)}
          >
            <b>{n.message}</b>
            <br />
            <small className="text-muted">
              {new Date(n.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </>
  );
}
