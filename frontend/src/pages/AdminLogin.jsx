import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
  const res = await API.post("/auth/login", { email, password });
  console.log("Login success:", res.data);
  localStorage.setItem("token", res.data.token);
  navigate("/admin/dashboard");
} catch (err) {
  console.log("Login error:", err.response ? err.response.data : err);
  setError("Invalid email or password");
}
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Admin Login</h3>

      <form onSubmit={handleLogin}>

        <div className="mb-3">
          <label>Email</label>
          <input 
            className="form-control" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input 
            type="password"
            className="form-control" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <div className="text-center mt-3">
        <a href="/" className="text-secondary">Back to tracking</a>
      </div>
    </div>
  );
}
