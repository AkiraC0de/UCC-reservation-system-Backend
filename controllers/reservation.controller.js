const Reservation = require('../models/reservation.model.js');
const User = require('../models/user.model.js'); 

const {formatDateToString} = require('../utils/formatDate.js')

const getUserReservations = async (req, res) => {
    const { limit } = req.query; //access queries;
    const { id } = req.user;  
    
    try {
        const data = await Reservation.find({ reservedBy: id }).populate('reservedBy').sort({ createdAt: -1 });
        const filteredData = data.filter(item => item.reservedBy._id.equals(id));

  
        //Check if the limit query is existed
        if(limit){
            const limitData = filteredData.slice(0, limit)
             return res.status(200).json({
                success: true,
                data: limitData,
            })
        }

        res.status(200).json({
            success: true,
            data: filteredData,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Server error while fetching reservations'
        });
    }
}

const addReservation = async (req, res) => { 
    const user = req.user
    try {
        //Should add validation if the reservation will hava a conflic to other reservations

        const newReservation =  await Reservation.create({
            ...req.body,
            reservedBy: user.id,
            type: "Reserved"
        });
        
        res.status(201).json({
            success: true,
            message: `The reservation request has been successfully sent..`, 
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
        const findData = await Reservation.findById(req.params.id);

        if(!findData) {
            return res.status(404).json({
                success: false,
                message: `The Reservation ${user.id}} is not existed`
            })
        }

        // Validate if the user own this reservation before updating
        const reservedById = String(findData.reservedBy);
        const userId = String(user.id)

        if(reservedById !== userId){
            return res.status(403).json({
                success: false,
                message: `You are not Authorized to Update this reservation`
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

const deleteReservation = async (req, res) => {
    const user = req.user;

    try {
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({
                success: false,
                message: `The Reservation ${req.params.id} is not existed` 
            })
        }

         // Validate if the user own this reservation before deleting
        const reservedById = String(reservation.reservedBy);
        const userId = String(user.id)

        if(reservedById !== userId){
            return res.status(403).json({
                success: false,
                message: `You are not Authorized to Delete this reservation`
            })
        }

        const data = await Reservation.deleteOne({_id: req.params.id});
        res.status(200).json({
            success: true,
            message: `The reservation ${req.params.id} has been deleted`,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: `Server Error: Reservation ${req.params.id} cannot be deleted.`})
    }
}

/**
 * Controller to fetch all Confirmed reservations for a specific room
 * within the next 7 days, based on the 'date' field.
 * * @route GET /api/all-reservation?roomId={roomId}
 */
const getRoomReservationsForNext7Days = async (req, res) => {
    // 1. Get roomId from query parameters (Standard for GET requests)
    const { roomId } = req.query; 

    // 2. Validate roomId presence
    if (!roomId) {
        return res.status(400).json({
            success: false,
            message: 'roomId is required in the query parameters.'
        });
    }

    try {
        // --- Date Calculation Logic ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // Calculate the starting date string (Today)
        const todayString = formatDateToString(today);

        // Calculate 7 days from now (inclusive)
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        // We look for reservations up to the end of the 7th day, so we don't change the hours/minutes/seconds.

        // Calculate the *exclusive* string for the range
        const exclusiveEndString = formatDateToString(sevenDaysLater);

        // Mongoose query finds reservations that:
        // 1. Match the provided roomId
        // 2. Have a status of "Confirmed"
        // 3. Have a 'date' greater than or equal to today
        // 4. Have a 'date' less than the date 7 days from now (effectively including 7 days total)
        const data = await Reservation.find({
            roomId: roomId,
            status: "confirmed", // Only "confirmed" reservations
            date: { 
                $gte: todayString,         // Start today (e.g., "2025-10-04")
                $lt: exclusiveEndString    // End before 7 days from today (e.g., "2025-10-11")
            }
        })
        .populate('reservedBy') // Populate the user details if needed
        .sort({ date: 1 }); // Sort by date and then starting time

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No confirmed reservations found for this room in the next 7 days.'
            });
        }

        res.status(200).json({
            success: true,
            data: data,
        });

    } catch (error) {
        console.error("Error fetching room reservations:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching room reservations.'
        });
    }
}

module.exports = { 
    getUserReservations, 
    addReservation, 
    updateReservation,
    deleteReservation,
    getRoomReservationsForNext7Days
};