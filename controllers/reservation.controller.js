const Reservation = require('../models/reservation.model.js');
const User = require('../models/user.model.js'); 

const getUserReservations = async (req, res) => {
    const { limit } = req.query; //access queries;
    const { id } = req.user;  
    
    try {
        const data = await User.findOne({_id: id}).populate('reservationsMade');

        //Check if the limit query is existed
        if(limit){
            const limitData = data.reservationsMade.slice(0, limit)
             return res.status(200).json({
                success: true,
                data: limitData,
            })
        }

        res.status(200).json({
            success: true,
            data: data.reservationsMade,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
}

const reservationPostController = async (req, res) => { 
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
}

const updateReservation = async (req, res) => {
    // Prevent modifying immutable data 
    // _id updatedAt createdAt
    const { _id, updatedAt, createdAt, ...safeBody } = req.body; 
    const user = req.user;

    try {
        //Look for the data if it was existed before updating it
        const findData = await Reservation.findById(user.id);

        if(!findData) {
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id}} is not existed`
            })
        }

        //update the data
        const data = await Reservation.updateOne({_id: user.id}, safeBody);
       
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
        })
    } catch (error) {
        res.status(500).json({message: `Server Error: Reservation ${req.params.id} cannot be deleted.`, data})
    }
}

module.exports = { 
    getUserReservations, 
    reservationPostController, 
    updateReservation,
    reservationDeleteController 
};