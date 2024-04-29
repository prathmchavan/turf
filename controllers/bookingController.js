const dbClient = require('../utils/dbConnection');
const { ObjectId } = require('mongodb');

exports.bookTurf = async (req, res) => {
  const { turf_Id, Date, time_slot, user_Name, contact_No, user_email, no_of_players, payment_method } = req.body;

  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const bookingCollection = db.collection('booking');

    // Check for existing booking
    const existingBooking = await bookingCollection.findOne({ 
      turf_Id: ObjectId(turf_Id), 
      Date: new Date(Date), 
      time_slot 
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: "The time slot is already booked" });
    }

    const newBooking = {
      turf_Id: ObjectId(turf_Id),
      Date: new Date(Date),
      time_slot,
      user_Name,
      contact_No,
      user_email,
      no_of_players,
      payment_method,
    };

    const result = await bookingCollection.insertOne(newBooking);

    res.status(200).json({ success: true, data: result.insertedId, message: "Turf booked successfully" });
  } catch (err) {
    console.error("Error booking turf:", err);
    res.status(500).json({ success: false, message: "An error occurred while booking the turf" });
  } finally {
    await dbClient.close();
  }
};

exports.getBookingById = async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const bookingCollection = db.collection('booking');

    const booking = await bookingCollection.findOne({ _id: ObjectId(bookingId) });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking, message: "Booking retrieved successfully" });
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ success: false, message: "An error occurred while fetching the booking" });
  } finally {
    await dbClient.close();
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    await dbClient.connect();
    const db = dbClient.db('turf');
    const bookingCollection = db.collection('booking');

    const bookings = await bookingCollection.find().toArray();

    res.status(200).json({ success: true, data: bookings, message: "Bookings retrieved successfully" });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "An error occurred while fetching bookings" });
  } finally {
    await dbClient.close();
  }
};
