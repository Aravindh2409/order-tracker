const db = require('../db');

// CREATE
async function createOrder(req, res) {
  try {
    const { product_name, customer_name, quantity, product_description } = req.body;

    const [result] = await db.query(
      `INSERT INTO orders (product_name, customer_name, quantity, product_description)
       VALUES (?, ?, ?, ?)`,
      [product_name, customer_name, quantity, product_description]
    );

    const newId = result.insertId;
    const prefix = customer_name.substring(0, 3).toUpperCase();
    const order_code = `${prefix}_${newId}`;

    await db.query(`UPDATE orders SET order_code = ? WHERE id = ?`, [
      order_code,
      newId,
    ]);

    res.json({ success: true, message: "Order created", order_code });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "create failed" });
  }
}

async function getOrderByCode(req, res) {
  try {
    const { code } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM orders WHERE order_code = ? AND is_deleted = 0`,
      [code]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "not found" });
    }

    res.json({ order: rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "tracking failed" });
  }
}


// PENDING ORDERS  (is_deleted = 0 AND status != completed)
async function listPending(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM orders
       WHERE is_deleted = 0 AND status != 'completed'
       ORDER BY updated_at DESC`
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ error: "pending list failed" });
  }
}


// COMPLETED ORDERS  (is_deleted = 0 AND status = completed)
async function listCompleted(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM orders
       WHERE is_deleted = 0 AND status = 'completed'
       ORDER BY updated_at DESC`
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ error: "completed list failed" });
  }
}


// DELETED ORDERS (is_deleted = 1)
async function listDeleted(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM orders
       WHERE is_deleted = 1
       ORDER BY updated_at DESC`
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ error: "deleted list failed" });
  }
}


// GET SINGLE ORDER
async function getOrder(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "not found" });

    res.json({ order: rows[0] });

  } catch {
    res.status(500).json({ error: "get failed" });
  }
}


// UPDATE STATUS
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );

    const [rows] = await db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    res.json({ order: rows[0] });

  } catch {
    res.status(500).json({ error: "update failed" });
  }
}


// DELETE (SET is_deleted = 1)
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE orders SET is_deleted = 1, updated_at = NOW() WHERE id = ?`,
      [id]
    );

    res.json({ success: true });

  } catch {
    res.status(500).json({ error: "delete failed" });
  }
}

module.exports = {
  createOrder,
  listPending,
  listCompleted,
  listDeleted,
  getOrder,
  updateStatus,
  deleteOrder,
  getOrderByCode
};
