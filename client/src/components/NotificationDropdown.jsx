import React, { useEffect, useState, useCallback } from "react";
import { getNotifications, markAsRead } from "../services/notificationService";

export default function NotificationDropdown() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getNotifications(token);
      setList(res.data);
    } catch (err) {
      console.log("Notification Fetch Error:", err);
    }
  }, [token]);

  const onItemClick = async (id) => {
    await markAsRead(id, token);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = list.filter(n => !n.is_read).length;

  return (
    <div className="position-relative">
      <button
        className="btn btn-light position-relative"
        onClick={() => setOpen(!open)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="dropdown-menu show p-2"
          style={{
            width: "300px",
            right: 0,
            left: "auto",
            position: "absolute",
            zIndex: 2000,
          }}
        >
          <strong>Notifications</strong>
          <hr />

          {list.length === 0 && <p className="text-muted">No notifications</p>}

          {list.map(n => (
            <div
              key={n._id}
              className={`p-2 mb-2 rounded shadow-sm ${n.is_read ? "bg-white" : "bg-warning"}`}
              style={{
                cursor: "pointer",
                borderLeft: n.is_read ? "none" : "4px solid #ff8800",
              }}
              onClick={() => onItemClick(n._id)}
            >
              <div className="small fw-bold">{n.message}</div>
              <small className="text-muted">
                {new Date(n.created_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
