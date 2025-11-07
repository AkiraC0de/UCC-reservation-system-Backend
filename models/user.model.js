const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    program:{
        type: String,
    },
    yearLevel:{
        type: Number,
    },
    section:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty'],
        default: 'student',
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'archived'],
        default: 'pending',
    },
    isEmailVerified: {
        type: Boolean,
    },
    verificationCode: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    reservationsMade: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Reservation',
        default: []
    },
    itemsReserved: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ItemReservation',
        default: []
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User