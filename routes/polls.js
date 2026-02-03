const express = require('express');
const router = express.Router();
const { createPoll, votePoll } = require('../controllers/polls');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPoll);
router.post('/:id/vote', protect, votePoll);

module.exports = router;