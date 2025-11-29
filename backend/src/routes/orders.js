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
} = require("../controllers/ordersController");

const { requireAuth } = require("../middleware/authMiddleware");

// LIST ROUTES
router.get("/pending/all", requireAuth, listPending);
router.get("/completed/all", requireAuth, listCompleted);
router.get("/deleted/all", requireAuth, listDeleted);

// CREATE / UPDATE / DELETE ROUTES
router.post("/", requireAuth, createOrder);
router.patch("/:id/status", requireAuth, updateStatus);
router.delete("/:id", requireAuth, deleteOrder);

// SINGLE ORDER (KEEP **LAST**)
router.get("/:id", requireAuth, getOrder);

module.exports = router;
