const mongoose = require('mongoose');
const { validateTimeFormat } = require('../utils/validateTime')

const reservationSchema = new mongoose.Schema({
    //ROOM ID is needed
    roomId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    startingTime: {
        type: Number,
        required: true,
    },
    outTime:  {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    purpose: {
        type: String,
        required: true
    },
    weekDay: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'Reserved'
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;