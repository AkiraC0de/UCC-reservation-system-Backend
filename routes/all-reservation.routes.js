const express = require('express');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { 
  getRoomReservationsForNext7Days, 
  getAllReservation,
  updateSingleReservationAdmin
} = require('../controllers/reservation.controller');

const allReservationRoute = express.Router();

allReservationRoute.get('/', verifyAuthJWT, getRoomReservationsForNext7Days)
allReservationRoute.get('/admin', verifyAuthJWT, getAllReservation)
allReservationRoute.put('/admin/update/:id', verifyAuthJWT, updateSingleReservationAdmin)

module.exports = allReservationRoute