const database = require('../connect');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;

const { 
    reservationGetController, 
    reservationPostController, 
    reservationPutController, 
    reservationDeleteController 
} = require('../controllers/reservation.controllers');

const { sanitizeReservation } = require('../middlewares/sanitizeReservation')

const reservationRoute = express.Router();

// #1 GET
// ask for all reservations data
reservationRoute.get('/', reservationGetController);

//#2 GET with limit query
reservationRoute.get('/?limit', (req, res) => {console.log(req.query)})

// #3 POST 
// post a new reservation 
reservationRoute.post('/',sanitizeReservation ,reservationPostController);

//#4 PUT
// Update one reservation data
reservationRoute.put('/:id', sanitizeReservation, reservationPutController);

//#5 DELETE
// Delete reservation data
reservationRoute.delete('/:id', reservationDeleteController)

module.exports = reservationRoute;