const db = require('../db');

async function createOrder(req, res) {
  try {
    const {
      product_name,
      customer_name,
      quantity,
      product_description
    } = req.body;

    // 1. Insert without order_code to get ID
    const [result] = await db.query(
      `INSERT INTO orders (product_name, customer_name, quantity, product_description)
       VALUES (?, ?, ?, ?)`,
      [product_name, customer_name, quantity, product_description]
    );

    const newId = result.insertId;

    // 2. Generate prefix from first 3 letters of customer name
    const prefix = customer_name.substring(0, 3).toUpperCase();

    // 3. Create order code
    const order_code = `${prefix}_${newId}`;

    // 4. Update the order with the generated order_code
    await db.query(
      `UPDATE orders SET order_code = ? WHERE id = ?`,
      [order_code, newId]
    );

    res.json({
      success: true,
      message: "Order created successfully",
      order_code: order_code
    });

  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
}



async function listOrders(req, res) {
  try {
    const [rows] = await db.query(`SELECT * FROM orders ORDER BY updated_at DESC LIMIT 200`);
    res.json({ orders: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'list failed' });
  }
}

async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ order: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'get failed' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['registered','processing','completing','completed'].includes(status)) return res.status(400).json({ error: 'invalid status' });
    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    const [rows] = await db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    res.json({ order: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'update failed' });
  }
}
async function getOrderByCode(req, res) {
  try {
    const { code } = req.params;
    const [rows] = await db.query('SELECT * FROM orders WHERE order_code = ?', [code]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order: rows[0] });
  } catch (err) {
    console.error('getOrderByCode error', err);
    res.status(500).json({ error: 'get by code failed' });
  }
}
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM orders WHERE id = ?", [id]);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
}


module.exports = { createOrder, listOrders, getOrder, updateStatus,getOrderByCode,deleteOrder};
