const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

async function seedData() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('turf');

    // Collections
    const ownerCollection = db.collection('owner');
    const turfCollection = db.collection('turf');
    const sportsCollection = db.collection('sports');
    const usersCollection = db.collection('users');
    const bookingCollection = db.collection('booking');

    // Insert Owners
    await ownerCollection.insertMany([
      { owner_Name: 'Rajesh Kumar', contact_Details: 'rajesh@example.com' },
      { owner_Name: 'Priya Singh', contact_Details: 'priya@example.com' },
      { owner_Name: 'Amit Patel', contact_Details: 'amit@example.com' },
      { owner_Name: 'Anjali Gupta', contact_Details: 'anjali@example.com' },
      { owner_Name: 'Suresh Sharma', contact_Details: 'suresh@example.com' },
      { owner_Name: 'Neha Desai', contact_Details: 'neha@example.com' },
      { owner_Name: 'Rohit Verma', contact_Details: 'rohit@example.com' },
      { owner_Name: 'Pooja Mehta', contact_Details: 'pooja@example.com' },
      { owner_Name: 'Vikram Yadav', contact_Details: 'vikram@example.com' },
      { owner_Name: 'Deepika Shah', contact_Details: 'deepika@example.com' },
    ]);

    // Insert Turfs
    await turfCollection.insertMany([
      {
        turf_Name: 'GreenValley Garden',
        owner_Id: new ObjectId(), // Ensure this ID matches an existing owner
        Rate_Night: 1500,
        Amenities: 'Swimming Pool, Tennis Court',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQW4DtUMB1Kjb2glA9LdbOPhfv1dg7ju3jxNG8xP2gCQ&s',
        location: 'Dhongde Nagar',
        ratings: Math.floor(1 + Math.random() * 5).toString(),
        no_of_ratings: Math.floor(100 + Math.random() * 50).toString(),
      },
      {
        turf_Name: 'Royal Meadows',
        owner_Id: new ObjectId(), // Ensure this ID matches an existing owner
        Rate_Night: 2000,
        Amenities: 'Gym, Spa, Restaurant',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUA3eFU2NjrZaJ7wx-A06qQpyVo57zgqLDHdcT7pt3RQ&s',
        location: 'Gangapur Road',
        ratings: Math.floor(1 + Math.random() * 5).toString(),
        no_of_ratings: Math.floor(100 + Math.random() * 50).toString(),
      },
      // Add more turf data here...
    ]);

    // Insert Sports
    await sportsCollection.insertMany([
      { sport_Name: 'Cricket' },
      { sport_Name: 'Football' },
      { sport_Name: 'Badminton' },
      { sport_Name: 'Tennis' },
      { sport_Name: 'Basketball' },
      { sport_Name: 'Volleyball' },
      { sport_Name: 'Hockey' },
      { sport_Name: 'Table Tennis' },
      { sport_Name: 'Swimming' },
      { sport_Name: 'Athletics' },
    ]);

    // Insert Users
    await usersCollection.insertMany([
      { user_Name: 'John Doe', contact_No: '1234567890', password: 'password123' },
      { user_Name: 'Jane Smith', contact_No: '0987654321', password: 'password321' },
      // Add more users if needed
    ]);

    console.log("Data seeded successfully");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await client.close();
  }
}

module.exports = seedData;
