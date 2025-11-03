const express = require('express');

const { 
    getUserReservations, 
    addReservation, 
    updateReservation, 
    deleteReservation,
} = require('../controllers/reservation.controller');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { validateReservationTime } = require('../middlewares/validateReservationTime') 

const reservationRoute = express.Router();

// #1 GET
// ask for all user reservations data
reservationRoute.get('/', verifyAuthJWT, getUserReservations);

// #2 POST 
// post a new reservation 
reservationRoute.post('/', verifyAuthJWT, addReservation);

//#3 PUT
// Update one reservation data
reservationRoute.put('/:id', verifyAuthJWT, validateReservationTime, updateReservation);

//#4 DELETE
// Delete reservation data
reservationRoute.delete('/:id', verifyAuthJWT, deleteReservation)


module.exports = reservationRoute;