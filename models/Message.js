const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    thread: {
        type: mongoose.Schema.ObjectId,
        ref: 'Thread',
        required: true
    },
    expediteur: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    contenu: {
        type: String,
        required: [true, 'Le message ne peut pas être vide'],
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);