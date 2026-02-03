const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    groupe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        required: false
    },
    evenement: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Thread', ThreadSchema);