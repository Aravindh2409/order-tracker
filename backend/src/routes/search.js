const express = require('express');
const router = express.Router();
const { searchHandler } = require('../controllers/searchController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', searchHandler);

module.exports = router;
