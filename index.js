const express=require('express');
const app=express();

const port=8080;
const mysql=require('mysql2');
app.use(express.json());
const cors=require("cors");
app.use(cors());


const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'turf',
    password: "manager"
});
    
//////////////////////////////////////////////////////////listen/////////////////////////////////////////

app.listen(port,(req,res)=>{
    console.log("Listening to the port" ,port);
})


////////////////////////////////////////////////////get the turf data ////////////////////////////////////

app.get('/home',(req,res)=>{


    const getData="select * from  turf";
    try{

       connection.query(getData,(err,result)=>{
            if(err) throw err;
            res.status(200).json({
                success:true,
                data:result,
                message:"data retrieved successfully"
            });
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            data:null,
            message:"an error occured while fetching the data"
        })
    }
})

app.get('/home/:turfId', (req, res) => {
    const turfId = req.params.turfId;
    const getData = `
        SELECT t.*, CONCAT(o.owner_Name, ' - ', o.contact_Details) AS owner_info
        FROM turf t
        JOIN owner o ON t.owner_Id = o.owner_Id
        WHERE t.turf_Id = ?
    `;
    try {
        connection.query(getData, [turfId], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    data: null,
                    message: "Turf not found"
                });
            }
            res.status(200).json({
                success: true,
                data: result[0],
                message: "Turf data retrieved successfully"
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: null,
            message: "An error occurred while fetching the turf data"
        });
    }
});



////////////////////////////////////////////////add turf/////////////////////////////////////////////////////

app.post('/addturf',(req,res)=>{
    const {turf_Name,owner_Id,Rate_Night,Amenities}=req.body;
    const addTurf="insert into turf(turf_Name,owner_Id,Rate_Night,Amenities) values (?,?,?,?)";
    
    try{
        connection.query(addTurf,[turf_Name,owner_Id,Rate_Night,Amenities],(err,result)=>{

            if (err) throw err;

            res.status(200).json({
                success:true,
                data:result,
                message:"turf added succesfully"
            })
        })
    }catch(err){
        res.status(500).json({
            success:false,
            data:null,
            message:"an error occured while adding  the data"
        })
        
    }
})


/////////////////////////////////////////////add owner ///////////////////////////////////////////

app.post('/owner',(req,res)=>{

    const{owner_Name,contact_Details}=req.body;
    const addOwner="insert into owner(owner_Name,contact_Details) values (?,?)";

    try{connection.query(addOwner,[owner_Name,contact_Details],(err,result)=>{
        if(err) throw err;
        res.status(200).json({
            success:true,
            data:result,
            message:"owner added succesfully"
        })
    })}
    catch(err){
        res.status(500).json({
            success:false,
            data:"internal server error",
            message:"an error occured while adding  the owner"
        })
    }
})


///////////////////////////////////////////////add user//////////////////////////////////////////////

app.post('/user', (req,res)=>{

    const {user_Name,contact_No,password}=req.body;
    const addUser='insert into users(user_Name,contact_No,password) values (?,?,?)';

    try{
        connection.query(addUser,[user_Name,contact_No,password],(err,result)=>{

            if(err) throw err;

            res.status(200).json({
                success:true,
                data:result,
                message:"user added succesfully"
            })
        })
    }catch(err){
        res.status(500).json({
            success:false,
            data:"internal server error",
            message:"an error occured while adding  the owner"
        })
    }
})


////////////////////////////////////booking////////////////////////////////////////////////////////

app.post('/book', async (req, res) => {
    const { user_Name, contact_No, turf_Id, Date, time_slot, user_email, no_of_players, payment_method } = req.body;

    // Check if the booking slot is already booked
    const checkBookingSql = 'SELECT * FROM booking WHERE turf_Id = ? AND Date = ? AND time_slot = ?';
    const checkBookingValues = [turf_Id, Date, time_slot];

    try {
        const checkBookingResult = await new Promise((resolve, reject) => {
            connection.query(checkBookingSql, checkBookingValues, (err, results) => {
                if (err) {
                    console.error('Error checking booking: ' + err.stack);
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        if (checkBookingResult.length > 0) {
            console.log('The time slot is already booked');
            return res.status(400).send('The time slot is already booked');
        }

        // Insert booking data into the database
        const bookTurfQuery = `INSERT INTO Booking (turf_Id, Date, time_slot, user_Name, contact_No, user_email, no_of_players, payment_method) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const bookTurfValues = [turf_Id, Date, time_slot, user_Name, contact_No, user_email, no_of_players, payment_method];

        // Move the declaration outside the try block
        let insertResult;

        // Perform the database query
        await new Promise((resolve, reject) => {
            connection.query(bookTurfQuery, bookTurfValues, (err, result) => {
                if (err) {
                    console.error('Error booking turf: ' + err.stack);
                    reject(err);
                    return;
                }
                // Assign the result to insertResult
                insertResult = result;
                resolve();
            });
        });

        const bookingId = insertResult.insertId; // Get the auto-generated booking ID

        res.status(200).json({
            success: true,
            booking_id: bookingId,
            message: "Turf booked successfully"
        });
    } catch (err) {
        console.error("An error occurred: " + err);
        res.status(500).json({
            success: false,
            message: "An error occurred while booking turf"
        });
    }
});




//////////////////////////////////////////////////check booking ///////////////////////////////////////////////

app.get('/booking/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;
    const sql = `
    SELECT 
      booking.booking_Id,
      booking.turf_Id,
      booking.Date,
      booking.currentDate,
      booking.time_Slot,
      booking.user_Name,
      booking.user_email,
      booking.no_of_players,
      booking.contact_No,
      booking.payment_method,
      turf.*
    FROM 
      booking
    JOIN 
      turf ON booking.turf_Id = turf.turf_Id
    WHERE 
      booking.booking_Id = ?;
  `;
  
    connection.query(sql, [bookingId], (err, results) => {
      if (err) {
        console.error('Error retrieving booking details: ' + err.stack);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ success: false, message: 'Booking not found' });
        return;
      }
  
      const bookingDetails = results[0];
      res.status(200).json({ success: true, data: bookingDetails });
    });
  });


  //----------------Admin--------------------

  app.get('/admin', (req, res) => {
    // Query to fetch all bookings
    const sql = 'SELECT booking.*, turf.turf_Name, turf.src FROM booking JOIN turf ON booking.turf_Id = turf.turf_Id';
  
    // Execute the query
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching bookings: ' + err.stack);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // If bookings are found, send them as JSON response
      if (results.length > 0) {
        res.json(results);
      } else {
        // If no bookings are found, send empty array
        res.json([]);
      }
    });
  });