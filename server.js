const express = require('express');
const { connectToDatabase } = require('./connect');

const cors = require('cors');
const cookieParser = require('cookie-parser');

//routes
const reservationRoute = require('./routes/reservertion.routes');
const authRoute = require('./routes/auth.routes');
const allReservationRoute = require('./routes/all-reservation.routes');
const itemReservationRoute = require('./routes/item-reservation.routes');
const adminRoutes = require('./routes/admin.routes')
const itemRoutes = require('./routes/Item.routes')

const app = express();

app.use("/uploads/users", express.static("uploads/users"));
app.use("/uploads/items", express.static("uploads/items"));

app.use(cors({ credentials: true , origin: process.env.FRONTEND_ORIGIN}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/reservation', reservationRoute);
app.use('/api/auth', authRoute);
app.use('/api/all-reservation', allReservationRoute)
app.use('/api/item-reservation', itemReservationRoute)

app.use('/api/items', itemRoutes)

app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
    connectToDatabase();
    console.log('server is running at PORT: ', process.env.PORT)
})