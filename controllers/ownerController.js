const dbClient = require('../utils/dbConnection');
const { ObjectId } = require('mongodb');

// Add a new owner
exports.createOwner = async (req, res) => {
  const { owner_Name, contact_Details } = req.body;

  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const ownerCollection = db.collection('owner');

    const newOwner = { owner_Name, contact_Details };

    const result = await ownerCollection.insertOne(newOwner);

    res.status(200).json({ success: true, data: result.insertedId, message: "Owner added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding owner" });
  } finally {
    await dbClient.close();
  }
};

// Get all owners (optional, if required)
exports.getAllOwners = async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const ownerCollection = db.collection('owner');

    const owners = await ownerCollection.find().toArray();

    res.status(200).json({ success: true, data: owners, message: "Owners retrieved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching owners" });
  } finally {
    await dbClient.close();
  }
};
