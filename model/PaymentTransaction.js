const mongoose = require('mongoose');
const paymentTransactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    bookingCode: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    accountNumber: { type: String, default: '' },
    content: { type: String, default: '' },
    receivedAt: { type: Date, default: Date.now },
    result: { type: String, default: 'received' }
}, { timestamps: true });
module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
