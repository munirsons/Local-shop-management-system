// import { useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout, onMenuClick }) {
  // const location = useLocation();
  // const isDashboard = location.pathname === "/dashboard";

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
      style={{ background: "#111", color: "white" }}
    >

      {/* Store Name */}
      <h4 className="m-0" style={{ fontWeight: "bold", color: "#4CAF50" }}>
        MS Store
      </h4>

      {/* Center Welcome Message */}
      <h5 className="m-0 text-center" style={{ flex: 1 }}>
        We are Wellcomimg to you on our Store.
      </h5>

      {/* Date & Logout  */}
      <div className="d-flex align-items-center gap-4">
        <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          {new Date().toLocaleString()}
        </span>

        <button className="btn btn-danger btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
