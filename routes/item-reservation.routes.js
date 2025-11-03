const express = require('express');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT')

const { 
  createReservation,
  getAllReservations,
  getItemReservationsForNext7Days,
  updateItemReservation
} = require('../controllers/reservation.controller');

const itemReservationRoute = express.Router();

itemReservationRoute.get('/', verifyAuthJWT, getAllReservations)
itemReservationRoute.post('/', verifyAuthJWT, createReservation)
itemReservationRoute.get('/7days', verifyAuthJWT, getItemReservationsForNext7Days)
itemReservationRoute.put('/:id', verifyAuthJWT, updateItemReservation)


module.exports = itemReservationRoute