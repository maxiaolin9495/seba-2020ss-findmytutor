"use strict";

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    time: {
        type: String,
        required: false
    },
    customerEmail: {
        type: String,
        required: true
    },
    tutorEmail: {
        type: String,
        required: true
    },
    comprehensionRating: {
        type: Number,
        required: true
    },
    friendlinessRating: {
        type: Number,
        required: true
    },
    teachingStyleRating: {
        type: Number,
        required: true
    },
    overallRating: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Review', ReviewSchema);