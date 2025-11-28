import React, { useState } from "react";
import API from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function TrackPage() {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function handleTrack(e) {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderCode.trim()) return;

    try {
      const res = await API.get(`/orders/by-code/${orderCode.trim()}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
      setError("Order not found. Please check your Order Code.");
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">Track Your Order</h3>

      <form onSubmit={handleTrack} className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Enter Order Code (e.g., ORD-00001)"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Track</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {order && (
        <div className="card p-3">
          <h5>{order.order_code}</h5>

          <p><strong>Product:</strong> {order.product_name}</p>
          <p><strong>Customer:</strong> {order.customer_name}</p>
          <p><strong>Registered Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(order.updated_at).toLocaleString()}</p>

          <p>
            <strong>Status:</strong> 
            <span className="badge bg-info ms-2">{order.status}</span>
          </p>
        </div>
      )}

      <div className="text-center mt-4">
        <a href="/admin/login" className="text-secondary">Admin Login</a>
      </div>
    </div>
  );
}
