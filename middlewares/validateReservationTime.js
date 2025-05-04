const validateReservationTime = (req, res, next) => {
    const { startTime, endTime } = req.body.startTime;
}

module.exports = { validateReservationTime }