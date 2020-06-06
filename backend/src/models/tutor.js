"use strict";
const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
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
    },
    timeSlotIds: [{
        id: {
            type: String
        }
    }],
    bookedTutorialSessionIds: [{
        id: {
            type: String
        }
    }],
    rating: {
        type: Number
    },
    price: {
        type: String
    },
    ifProved: {
        type: Boolean,
        required: true
    },
    documentIds: [{
        id: {
            type: String
        }
    }],
});

module.exports = mongoose.model('tutors', TutorSchema);