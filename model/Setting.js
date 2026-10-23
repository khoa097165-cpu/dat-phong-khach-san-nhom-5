const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    key: {
        type: String, default: 'hotel', unique: true
    }, hotelName: {
        type: String, default: 'StayManager Hotel'
    }, address: {
        type: String, default: ''
    }, phone: {
        type: String, default: ''
    }, email: {
        type: String, default: ''
    }, checkInTime: {
        type: String, default: '14:00'
    }, checkOutTime: {
        type: String, default: '12:00'
    }, taxPercent: {
        type: Number, default: 0
    }, invoicePrefix: {
        type: String, default: 'HD'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Setting', schema);
