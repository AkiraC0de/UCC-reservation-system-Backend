const mongoose = require('mongoose');
const { validateTimeFormat } = require('../utils/validateTime')

const itemRervationSchema = new mongoose.Schema({
    //ROOM ID is needed
    itemId: {
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
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    purpose: {
        type: String,
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

const ItemReservation = mongoose.model('ItemReservation', itemRervationSchema);
module.exports = ItemReservation;