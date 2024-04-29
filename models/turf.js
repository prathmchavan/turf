const { ObjectId } = require('mongodb');

module.exports = {
  turf_Name: String,
  owner_Id: ObjectId,
  Rate_Night: Number,
  Amenities: String,
  src: String,
  ratings: String,
  location: String,
  no_of_ratings: String,
};
