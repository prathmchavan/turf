const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add a new user
router.post('/', userController.createUser);

// Get all users (if needed)
router.get('/', userController.getAllUsers);

module.exports = router;
