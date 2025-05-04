const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watchController');

// Route to add watch history
router.post('/', watchController.addWatchHistory);

// Route to fetch a user's watch history
router.get('/:userId', watchController.getWatchHistory);

module.exports = router;
