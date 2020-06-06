"use strict";
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: false
    },
    bookedTutorialSessionIds: [{
        id: {
            type: String
        }
    }]
});

module.exports = mongoose.model('customers', CustomerSchema);