const express = require('express');
const router = express.Router();
const { registerAdmin, login } = require('../controllers/authController');

// DEV: create admin (call once, then you can remove/ignore this route)
router.post('/register-admin', registerAdmin);

// Login
router.post('/login', login);

module.exports = router;
