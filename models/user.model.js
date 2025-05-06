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
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User