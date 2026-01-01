import React, { useEffect, useState, useCallback, useContext } from "react";
import { getUsers, createUser, deleteUser } from "../services/userService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarToggle from "../components/SidebarToggle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AddUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("Seller");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const loadUsers = useCallback(async () => {
    try {
      const res = await getUsers(token);
      setUsers(res.data);
    } catch (err) {
      console.error("User Load Error:", err);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async () => {
    if (!username || !password)
      return alert("Username & Password required!");

    await createUser({ username, password, designation }, token);
    alert("User created!");
    setUsername("");
    setPassword("");
    setDesignation("Seller");
    loadUsers();
  };

  const handleDelete = async (id, role) => {
    if (role === "CEO") return alert("CEO cannot be deleted!");
    if (!window.confirm("Delete this user?")) return;

    await deleteUser(id, token);
    loadUsers();
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        onMenuClick={() => setSidebarOpen(true)}/>
      <SidebarToggle onClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="container mt-5 text-white">
        <h3 className="mb-4 text-center">Add / Manage Users</h3>

        <div className="card p-3 mb-4 bg-secondary">
          <h3 style={{color:"white"}}><b>Create New User</b></h3>

          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="Seller">Seller</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-primary w-100"
                onClick={handleCreate}
              >
                ➕ Create User
              </button>
            </div>
          </div>
        </div>

        <div className="card p-3 bg-secondary">
          <h5>Users List</h5>

          <table className="table table-hover mt-3 text-white" 
  style={{ 
    '--bs-table-bg': 'rgb(30, 41, 59)',
    '--bs-table-color': 'white',
    '--bs-table-hover-bg': 'rgb(13,110,253)',
    '--bs-table-hover-color': 'white'
  }}>
            <thead>
              <tr>
                <th>Username</th>
                <th>User ID</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.user_id}</td>
                  <td>{u.designation}</td>
                  <td>
                    {u.designation !== "CEO" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u._id, u.designation)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No users found.
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
