const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    bookingCode: { type: String, unique: true, sparse: true, index: true },
    promoCode: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded', 'partially_refunded'], default: 'unpaid' },
    refundAmount: { type: Number, default: 0, min: 0 },
    customerEmail: { type: String, default: '' },
    customerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Customer'
    }, customerName: {
        type: String, required: true, trim: true
    }, customerPhone: {
        type: String, required: true, trim: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true
    }, checkInDate: {
        type: Date, required: true
    }, checkOutDate: {
        type: Date, required: true
    },
    actualCheckIn: {
        type: Date
    }, actualCheckOut: {
        type: Date
    }, guests: {
        type: Number, default: 1, min: 1
    }, seasonFactor: {
        type: Number, default: 1
    }, roomAmount: {
        type: Number, default: 0
    },
    serviceItems: [{
            serviceId: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Service'
            }, name: String, price: Number, quantity: {
                type: Number, default: 1
            }, amount: Number
        }],
    serviceAmount: {
        type: Number, default: 0
    }, discount: {
        type: Number, default: 0
    }, totalAmount: {
        type: Number, default: 0
    }, deposit: {
        type: Number, default: 0
    }, paidAmount: {
        type: Number, default: 0
    },
    paymentMethod: {
        type: String, enum: ['cash', 'transfer', 'card', 'other'], default: 'cash'
    },
    status: {
        type: String, enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled'], default: 'confirmed'
    }, notes: {
        type: String, default: ''
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Booking', bookingSchema);
