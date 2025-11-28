import React, { useState } from 'react';
import API from '../api';

export default function AddOrderForm({ onClose, onCreated }) {
  const [product_name, setProductName] = useState('');
  const [customer_name, setCustomerName] = useState('');
  const [product_description, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/orders', {
        product_name,
        customer_name,
        product_description,
        quantity
      });

      setLoading(false);
      onCreated();  // refresh orders table
      onClose();    // close popup
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
      setLoading(false);
    }
  }

  return (
    <div
      className="card p-3"
      style={{
        width: '400px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      <h5 className="mb-3">Add New Order</h5>

      <form onSubmit={submitForm}>

        

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            className="form-control"
            value={product_name}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            className="form-control"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            value={product_description}
            onChange={(e) => setProductDescription(e.target.value)}
            rows="2"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create Order'}
          </button>
        </div>

      </form>
    </div>
  );
}
