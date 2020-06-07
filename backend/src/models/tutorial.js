const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({

    tutorEmail: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    sessionTopic: {
        type: String,
        required: true
    },
    bookedTime: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    tutorialStatus: {
        type: String,
        required: true,
        enum: ['finished', 'cancelled', 'notConfirmed', 'confirmed', 'reviewed'],
    },
    transactionStatus: {
        type: String,
        required: true,
        enum: ['transfered', 'cancelled', 'paid'],
    }
});

module.exports = mongoose.model('tutorial', BookingSchema);