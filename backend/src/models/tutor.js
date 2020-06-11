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
    description:{
        type: String
    },
    ifProved: {
        type: Boolean,
        required: true,
    },
    documentIds: [{
        id: {
            type: String
        }
    }],
    courses: [{
        type: [String]
    }],
    avatar: {
        type: String
    }
});

module.exports = mongoose.model('tutors', TutorSchema);