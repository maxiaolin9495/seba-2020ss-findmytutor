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
        type: String
    },
    lastName: {
        type: String
    },
    university: {
        type: String
    },
    bookedTutorialSessionIds: [{
        id: {
            type: String
        }
    }]
});

module.exports = mongoose.model('customers', CustomerSchema);