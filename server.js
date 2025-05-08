const express = require('express');
const { connectToDatabase } = require('./connect');

const cors = require('cors');

//routes
const reservationRoute = require('./routes/reservertion.routes');
const authRoute = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoute);
app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
    connectToDatabase();
    console.log('server is running at PORT: ', process.env.PORT)
})