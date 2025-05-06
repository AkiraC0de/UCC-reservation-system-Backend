const database = require('../connect');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const { 
    reservationGetController, 
    reservationPostController, 
    reservationPutController, 
    reservationDeleteController 
} = require('../controllers/reservation.controllers');

const { sanitizeReservation } = require('../middlewares/sanitizeReservation');
const { validateReservationTime } = require('../middlewares/validateReservationTime') 

const reservationRoute = express.Router();

// #1 GET
// ask for all reservations data
reservationRoute.get('/', reservationGetController);

// #2 POST 
// post a new reservation 
reservationRoute.post('/',reservationPostController);

//#3 PUT
// Update one reservation data
reservationRoute.put('/:id', sanitizeReservation, validateReservationTime, reservationPutController);

//#4 DELETE
// Delete reservation data
reservationRoute.delete('/:id', reservationDeleteController)

module.exports = reservationRoute;