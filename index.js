const express = require('express');
const cors = require('cors');
const turfRoutes = require('./routes/turfRoute');
const ownerRoutes = require('./routes/ownerRoute');
const bookingRoutes = require('./routes/bookingRoute');
const seedRoute = require('./routes/seedRoute')
const userRoutes = require('./routes/userRoute');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use('/', (req, res) => {
    res.json({ message: 'working' }); // Return a simple JSON response
  });
app.use('/turf', turfRoutes);
app.use('/owner', ownerRoutes);
app.use('/booking', bookingRoutes);
app.use('/user', userRoutes);
app.use('/seed',seedRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
