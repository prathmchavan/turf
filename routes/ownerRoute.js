const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

// Add a new owner
router.post('/', ownerController.createOwner);

// Get all owners (if needed)
router.get('/', ownerController.getAllOwners);

module.exports = router;
