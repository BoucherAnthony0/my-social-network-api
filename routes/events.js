const express = require('express');
const router = express.Router();
const { createEvent } = require('../controllers/events');
const { protect } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validators');

router.route('/')
    .post(protect, validateEvent, createEvent);

module.exports = router;