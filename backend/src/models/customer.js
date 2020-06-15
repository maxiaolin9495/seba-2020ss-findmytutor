"use strict";
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    university: {
        type: String,
        required: false
    },
    bookedTutorialSessionIds: [{
        type: [String]
    }]
});

module.exports = mongoose.model('customers', CustomerSchema);