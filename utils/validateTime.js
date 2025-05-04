const validateTimeFormat = (time) => {
    const hour = Number(time.toString().slice(0, 2));
    const min = time.toString().slice(3, 5);

    const validateHour = hour > 0 && hour <= 24;
    const validataMin = min === '30' || min === '00';

    return validataMin && validateHour
}

const validateTimeValue = (startTime, endTime) => {
    const startTimeValue = Number(startTime.slice(0, 2)) + (startTime.slice(3, 5) === '30' ? 0.5 : 0);
    const endTimeValue = Number(endTime.slice(0, 2)) + (endTime.slice(3, 5) === '30' ? 0.5 : 0) ;

    return startTimeValue < endTimeValue;
}

module.exports = { 
    validateTimeFormat, 
    validateTimeValue
}