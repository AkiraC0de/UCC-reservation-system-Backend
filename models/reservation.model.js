const mongoose = require('mongoose');
const { validateTimeFormat } = require('../utils/validateTime')

const reservationSchema = new mongoose.Schema({
    //ROOM ID is needed
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validateTimeFormat(value),
            message: (props) => `${props.value} is not a valid time format. Expected format: HH:MM where MM can only be "00" or "30"`
        }
    },
    endTime:  {
        type: String,
        required: true,
        validate: {
            validator: (value) => validateTimeFormat(value),
            message: (props) => `${props.value} is not a valid time format. Expected format: HH:MM where MM can only be "00" or "30"`
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    purpose: String,
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;