const mongoose = require('mongoose');
const { validateTimeFormat } = require('../utils/validateTime')

const reservationSchema = new mongoose.Schema({
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
        enums: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    purpose: String,
    reservedBy: {
        type: String, // REQUIRE AN UPDATE: String For now since user model isnt established yet
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);