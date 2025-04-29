const database = require('../connect');
const express = require('express');

const reservationRoute = express.Router();

// #1 GET
// ask for all reservations data
reservationRoute.get('/', async (req, res) => {
    const db = database.getDb();
    
    try {
        const data = await db.collection('reservations').find({}).toArray();

        //Check if the reservation collection is empty before sending datas
        if(data.length === 0){
            res.status(200).json({
                success: true,
                message: "Reservation has no content",
                data: [],
            })
        } else {
            res.status(200).json({
                success: true,
                data: data,
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
    
})  

module.exports = reservationRoute;