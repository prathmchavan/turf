const dbClient = require('../utils/dbConnection');

// Add a new user
exports.createUser = async (req, res) => {
  const { user_Name, contact_No, password } = req.body;

  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const userCollection = db.collection('users');

    const newUser = { user_Name, contact_No, password };

    const result = await userCollection.insertOne(newUser);

    res.status(200).json({ success: true, data: result.insertedId, message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding user" });
  } finally {
    await dbClient.close();
  }
};

// Get all users (optional, if required)
exports.getAllUsers = async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const userCollection = db.collection('users');

    const users = await userCollection.find().toArray();

    res.status(200).json({ success: true, data: users, message: "Users retrieved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  } finally {
    await dbClient.close();
  }
};
