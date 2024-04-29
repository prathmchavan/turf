const dbClient = require('../utils/dbConnection');
const { ObjectId } = require('mongodb');

// Get all turfs
exports.getTurfs = async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const turfCollection = db.collection('turf');

    const turfs = await turfCollection.find().toArray();

    res.status(200).json({ success: true, data: turfs, message: "Turfs retrieved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching turfs" });
  } finally {
    await dbClient.close();
  }
};

// Get a specific turf by ID
exports.getTurfById = async (req, res) => {
  const turfId = req.params.turfId;
  console.log(turfId);
  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const turfCollection = db.collection('turf');

    const turf = await turfCollection.findOne({ _id: new ObjectId(turfId) });

    if (!turf) {
      return res.status(404).json({ success: false, message: "Turf not found" });
    }

    res.status(200).json({ success: true, data: turf, message: "Turf retrieved successfully" });
  }
   catch (err) {
    res.status(500).json({ success: false, message: "Error fetching turf" });
    console.log(err);
  } 
  finally {
    await dbClient.close();
  }
};

// Add a new turf
exports.addTurf = async (req, res) => {
  const { turf_Name, owner_Id, Rate_Night, Amenities } = req.body;

  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const turfCollection = db.collection('turf');

    const newTurf = {
      turf_Name,
      owner_Id: ObjectId(owner_Id),
      Rate_Night,
      Amenities,
    };

    const result = await turfCollection.insertOne(newTurf);

    res.status(200).json({ success: true, data: result.insertedId, message: "Turf added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding turf" });
  } finally {
    await dbClient.close();
  }
};
