const mongoose = require('mongoose');
const { validateTimeFormat } = require('../utils/validateTime')

const itemSchema = new mongoose.Schema({
    codeName: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    model:  {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'unavailable'],
        default: 'available',
    },
    totalReservations: {
        type: Number,
    },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;