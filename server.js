const express = require('express');
const database = require('./connect');

const cors = require('cors');

//routes
const reservationRoute = require('./routes/reservertion.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoute);

app.listen(process.env.PORT, () => {
    database.connectToDatabase();
    console.log('server is running at PORT: ', process.env.PORT)
})