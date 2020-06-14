"use strict";
const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
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
    timeSlotIds: [{
        start: {
            type: String
        },
        end: {
            type: String
        }
    }],
    bookedTutorialSessionIds: [{
        type: String
    }],
    rating: {
        type: Number
    },
    price: {
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
    ifProved: {
        type: Boolean,
        required: true,
    },
    documentIds: [{
        type: String,
        required: false
    }],
    courses: [{
        type: [String],
        required: false
    }],
    avatar: {
        type: String,
        required: false
    },
    reviewIds: [{
        type: [String],
        required: false
    }]
});

module.exports = mongoose.model('tutors', TutorSchema);