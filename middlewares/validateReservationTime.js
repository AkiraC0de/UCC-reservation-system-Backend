const validateReservationTime = (req, res, next) => {
    const { startTime, endTime } = req.body;

    //check the format of time

    const starHour = Number(startTime.slice(0,2));
}

module.exports = { validateReservationTime }