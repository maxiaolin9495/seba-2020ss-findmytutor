"use strict";
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    transactionStatus: {
        type: String,
        required: true,
        enum: ['transferred', 'cancelled', 'paid'],
    },
    transactionIds: [{
        type: String,
        required: false
    }],
});

module.exports = mongoose.model('transaction', TransactionSchema);