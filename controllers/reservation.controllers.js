const Reservation = require('../models/reservation.model.js');
const User = require('../models/user.model.js'); //SHOULD BE REMOVE ONCE AUTH ROUTES HAS BEEN ESTABLISHED

const reservationGetController = async (req, res, next) => {
    const { limit } = req.query; //access queries
    
    try {
        const data = await Reservation.find({});
        //Check if the reservation collection is empty before sending datas
        if(data.length === 0){
            return res.status(200).json({
                success: true,
                message: "Reservation has no content",
                data: [],
            })
        }

        //Check if the limit query is existed
        if(limit){
            const limitData = data.slice(0, limit)
             return res.status(200).json({
                success: true,
                data: limitData,
            })
        }

        res.status(200).json({
            success: true,
            data: data,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
    
    //proceed to next middleware
    next();
}

const reservationPostController = async (req, res, next) => {
    try {
        const newReservation =  await Reservation.create(req.body);
        
        res.status(201).json({
            success: true,
            message: `The Reservation has been created.`, 
            data: newReservation
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation cannot be sent.`
        })
    }

    //Proceed to middleware
    next();
}

const reservationPutController = async (req, res) => {
    // Prevent modifying immutable data 
    // _id updatedAt createdAt
    const { _id, updatedAt, createdAt, ...safeBody } = req.body; 

    try {
        //Look for the data if it was existed before updating it
        const findData = await Reservation.findById(req.params.id);

        if(!findData) {
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id}} is not existed`
            })
        }

        //update the data
        const data = await Reservation.updateOne({_id: req.params.id}, safeBody);
       
        res.status(200).json({
            success: true,
            message: `The Reservation ${req.params.id} has been updated.`, 
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: Reservation ${req.params.id} cannot be updated.`,
        })
    }
} 

const reservationDeleteController = async (req, res) => {
    // SHOULD BE UPDATE ONCE THE AUTH IS ESTABLISHED
    // TO AVOID USER DELETE DATA FROM DATA BASE WITHOUT PROPER PERMISSION

    try {
        const findData = await Reservation.findById(req.params.id);

        if(!findData){
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id} is not existed` 
            })
        }

        const data = await Reservation.deleteOne({_id: req.params.id});
        res.status(200).json({
            success: true,
            message: `The reservation ${req.params.id} has been deleted`,
            data: data
        })
    } catch (error) {
        res.status(500).json({message: `Server Error: Reservation ${req.params.id} cannot be deleted.`, data})
    }
}

module.exports = { 
    reservationGetController, 
    reservationPostController, 
    reservationPutController,
    reservationDeleteController 
};