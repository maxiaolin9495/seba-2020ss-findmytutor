const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
    tutorEmail: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    booked: {
        type: Boolean,
        required: true
    },
    attended: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('timeSlot', TimeSlotSchema);