const express = require('express');
const router = express.Router();
const { addTicketTypes, buyTicket } = require('../controllers/tickets');
const { protect } = require('../middleware/auth');

router.post('/setup', protect, addTicketTypes);
router.post('/buy', protect, buyTicket);

module.exports = router;