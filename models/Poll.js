const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    texte: { type: String, required: true }, 
    votes: [{ 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
});

const QuestionSchema = new mongoose.Schema({
    texte: { type: String, required: true }, 
    options: [OptionSchema] 
});

const PollSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, "Le titre du sondage est requis"],
        trim: true
    },
    evenement: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    creePar: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [QuestionSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', PollSchema);