const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to add watch history (requires authentication)
router.post('/', verifyToken, watchController.addWatchHistory);

// Route to fetch a user's watch history (with authentication)
router.get('/:userId', verifyToken, watchController.getWatchHistory);

module.exports = router;
