const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String, required: true, unique: true, trim: true
    }, type: {
        type: String, required: true, trim: true
    }, price: {
        type: Number, required: true, min: 0
    },
    capacity: {
        type: Number, default: 2, min: 1
    }, floor: {
        type: Number, default: 1
    }, amenities: {
        type: [String], default: []
    },
    status: {
        type: String, enum: ['available', 'cleaning', 'maintenance'], default: 'available'
    }, isAvailable: {
        type: Boolean, default: true
    }, notes: {
        type: String, default: ''
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Room', roomSchema);
