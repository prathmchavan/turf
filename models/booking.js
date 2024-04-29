const { ObjectId } = require('mongodb');

module.exports = {
  turf_Id: ObjectId,
  Date: Date,
  currentDate: {
    type: Date,
    default: Date.now // Set default value to current date and time
  },
  time_slot: String,
  user_Name: String,
  user_email: String,
  no_of_players: String,
  contact_No: String,
  payment_method: String,
};
