const express = require('express');

const { 
    getUserReservations, 
    reservationPostController, 
    reservationPutController, 
    reservationDeleteController 
} = require('../controllers/reservation.controller');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { validateReservationTime } = require('../middlewares/validateReservationTime') 

const reservationRoute = express.Router();

// #1 GET
// ask for all user reservations data
reservationRoute.get('/', verifyAuthJWT, getUserReservations);

// #2 POST 
// post a new reservation 
reservationRoute.post('/',validateReservationTime, reservationPostController);

//#3 PUT
// Update one reservation data
reservationRoute.put('/:id',validateReservationTime, reservationPutController);

//#4 DELETE
// Delete reservation data
reservationRoute.delete('/:id', reservationDeleteController)

module.exports = reservationRoute;