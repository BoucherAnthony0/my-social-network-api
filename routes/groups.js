const express = require('express');
const router = express.Router();
const { createGroup, getGroups, joinGroup } = require('../controllers/groups');
const { protect } = require('../middleware/auth'); 


router.route('/')
    .get(getGroups)
    .post(protect, createGroup);

router.route('/:id/join')
    .post(protect, joinGroup);

module.exports = router;