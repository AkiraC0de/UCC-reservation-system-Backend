const express = require('express');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { getRoomReservationsForNext7Days
} = require('../controllers/reservation.controller');

const allReservationRoute = express.Router();

allReservationRoute.get('/', verifyAuthJWT, getRoomReservationsForNext7Days)

module.exports = allReservationRoute;