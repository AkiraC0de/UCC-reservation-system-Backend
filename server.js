const express = require('express');
const { connectToDatabase } = require('./connect');

const cors = require('cors');
const cookieParser = require('cookie-parser');

//routes
const reservationRoute = require('./routes/reservertion.routes');
const authRoute = require('./routes/auth.routes');

const app = express();

app.use(cors({ credentials: true , origin: process.env.FRONTEND_ORIGIN}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/reservation', reservationRoute);
app.use('/api/auth', authRoute);

app.listen(process.env.PORT, () => {
    connectToDatabase();
    console.log('server is running at PORT: ', process.env.PORT)
})