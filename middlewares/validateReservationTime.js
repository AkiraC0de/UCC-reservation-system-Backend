const { 
    validateTimeFormat,
    validateTimeValue
 } = require('../utils/validateTime')

const validateReservationTime = (req, res, next) => {
    const { startTime, endTime } = req.body;

    //Validate the Time Format: 00:00 hour(01 to 24 only):minutes(00 or 30 only)
    if(!validateTimeFormat(startTime)){
        return res.status(400).json({success: false, message: `Error: Start Time format is invalid "${startTime}"`})
    }
    if(!validateTimeFormat(endTime)){
        return res.status(400).json({success: false, message: `Error: End Time format is invalid "${endTime}"`})
    }

    //Validate the time valie
    // The Starting must be earlier then the end time
    if(!validateTimeValue(startTime, endTime)){
        return res.status(400).json({success: false, message: `Error: Starting time must be ealier than end time "from ${startTime} to ${endTime}"`})
    }

    // Validate time availability to the database
    // the reservation data and time must be available to be able to send a reservation request
    // SOON

    next();
}

module.exports = { validateReservationTime }