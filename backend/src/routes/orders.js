const express = require("express");
const router = express.Router();

const {
  createOrder,
  listPending,
  listCompleted,
  listDeleted,
  getOrder,
  updateStatus,
  deleteOrder,
  getOrderByCode
} = require("../controllers/ordersController");

const { requireAuth } = require("../middleware/authMiddleware");


// ------------------------------------------------------
// PUBLIC ROUTE (NO AUTH) — Track by Order Code
// ------------------------------------------------------
router.get("/by-code/:code", getOrderByCode);


// ------------------------------------------------------
// PROTECTED ROUTES (Admin Only)
// ------------------------------------------------------

// List routes
router.get("/pending/all", requireAuth, listPending);
router.get("/completed/all", requireAuth, listCompleted);
router.get("/deleted/all", requireAuth, listDeleted);

// Create / Update / Delete
router.post("/", requireAuth, createOrder);
router.patch("/:id/status", requireAuth, updateStatus);
router.delete("/:id", requireAuth, deleteOrder);


// ------------------------------------------------------
// SINGLE ORDER BY ID (KEEP **LAST** TO AVOID CONFLICT)
// ------------------------------------------------------
router.get("/:id", requireAuth, getOrder);


module.exports = router;
