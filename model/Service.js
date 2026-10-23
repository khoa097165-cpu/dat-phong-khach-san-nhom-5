const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    }, price: {
        type: Number, required: true, min: 0
    }, unit: {
        type: String, default: 'lần'
    }, active: {
        type: Boolean, default: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Service', serviceSchema);
