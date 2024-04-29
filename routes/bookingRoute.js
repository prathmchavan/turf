const express = require('express');
const router = express.Router();
const bookingController=require("../controllers/bookingController");

router.post('/',bookingController.bookTurf );

router.get('/', bookingController.getAllBookings);

router.get('/:bookingId', bookingController.getBookingById);


module.exports = router;
