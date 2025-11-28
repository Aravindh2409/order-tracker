import React, { useState, useEffect } from "react";
import API from "../api";
import SearchBar from "../components/SearchBar";
import AddOrderForm from "../components/AddOrderForm";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      if (err.response?.status === 401) navigate("/admin/login");
    }
  }

  async function handleDelete(id) {
  const confirmDelete = window.confirm("Are you sure you want to delete this order?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/orders/${id}`);
    loadOrders();
    setSelected(null);
    alert("Order deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete order");
  }
}


  async function selectOrder(order) {
    const res = await API.get(`/orders/${order.id}`);
    setSelected(res.data.order);
  }

  async function updateStatus(id, status) {
    await API.patch(`/orders/${id}/status`, { status });
    loadOrders();
    setSelected(null);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between mb-3">
        <div className="w-50">
          <SearchBar onSelect={selectOrder} />
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddOrder(true)}>
          + New Order
        </button>
        <button className="btn btn-outline-danger ms-2" onClick={logout}>Logout</button>
      </div>

      <div className="row">
        {/* Orders table */}
        <div className="col-md-8">
          <div className="card p-3">
            <h5>Recent Orders</h5>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Registered</th>
                  <th>Updated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} onClick={() => selectOrder(o)} style={{ cursor: "pointer" }}>
                    <td>{o.order_code}</td>
                    <td>{o.product_name}</td>
                    <td>{o.customer_name}</td>
                    <td>{new Date(o.created_at).toLocaleString()}</td>
                    <td>{new Date(o.updated_at).toLocaleString()}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        <div className="col-md-4">
          <div className="card p-3">
            {selected ? (
              <>
                <h5>{selected.order_code}</h5>
                <p><strong>Product:</strong> {selected.product_name}</p>
                <p><strong>Customer:</strong> {selected.customer_name}</p>
                <p><strong>Registered:</strong> {new Date(selected.created_at).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selected.updated_at).toLocaleString()}</p>
                <p><strong>Status:</strong> {selected.status}</p>

                <h6>Update Status:</h6>
                <button 
  className="btn btn-danger btn-sm mb-3"
  onClick={() => handleDelete(selected.id)}
>
  Delete Order
</button>
                <div className="d-flex gap-2 mt-2">
                  {["registered", "processing", "completing", "completed"].map((s) => (
                    <button
                      key={s}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateStatus(selected.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p>Select an order</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Order Popup */}
      {showAddOrder && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <AddOrderForm
            onClose={() => setShowAddOrder(false)}
            onCreated={loadOrders}
          />
        </div>
      )}
    </div>
  );
}
