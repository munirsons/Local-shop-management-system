import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { username, password });

      // Store in LocalStorage for Access Control
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("designation", res.data.user.designation);

      login(res.data);
      navigate("/dashboard");

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="text-center"><b>MS Store Login</b></h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control my-2"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
