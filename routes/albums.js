const express = require('express');
const router = express.Router();
const { createAlbum, addPhoto } = require('../controllers/albums');
const { protect } = require('../middleware/auth');

router.post('/', protect, createAlbum);
router.post('/:id/photos', protect, addPhoto);

module.exports = router;