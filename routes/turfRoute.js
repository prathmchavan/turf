const express = require('express');
const router = express.Router();
const turfController = require('../controllers/turfController');

// Get all turfs
router.get('/', turfController.getTurfs);

// Get a specific turf by ID
router.get('/:turfId', turfController.getTurfById);

// Add a new turf
router.post('/', turfController.addTurf);

module.exports = router;
