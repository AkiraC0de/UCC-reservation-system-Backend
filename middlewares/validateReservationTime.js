const { validateTimeFormat } = require('../utils/validateTimeFormat')

const validateReservationTime = (req, res, next) => {
    const { startTime, endTime } = req.body;

    validateTimeFormat(startTime);

    const starHour = Number(startTime.slice(0,2));

    next();
}

module.exports = { validateReservationTime }