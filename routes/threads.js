const express = require('express');
const router = express.Router();
const { postMessage, getMessages } = require('../controllers/threads');
const { protect } = require('../middleware/auth');

router.post('/:threadId/messages', protect, postMessage);
router.get('/:contextId', protect, getMessages);

module.exports = router;