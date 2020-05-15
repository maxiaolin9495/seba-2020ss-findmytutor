"use strict";
const mongoose = require('mongoose');

const customerSupportSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    timeStamp: {
        type: String,
        required: true
    },
    supportStatus: {
        type: String,
        enum: ['open', 'inProgress', 'closed', 'canceled'],
        required: true
    },
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('customerSupport', customerSupportSchema);