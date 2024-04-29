const express = require('express');
const router = express.Router();
const seedDatabase = require('../data/seedData');

// Route to trigger seeding the database
router.post('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: "Database seeded successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while seeding the database" });
  }
});

module.exports = router;
