const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    texte: { type: String, required: true }, // Ex: "Oui", "Non", "Mardi"
    votes: [{ // Liste des utilisateurs qui ont choisi cette option
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
});

const QuestionSchema = new mongoose.Schema({
    texte: { type: String, required: true }, // Ex: "Quelle date vous arrange ?"
    options: [OptionSchema] // Les choix possibles
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
    creePar: { // L'organisateur qui a fait le sondage
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [QuestionSchema], // "Un sondage comporte 1 ou plusieurs questions"
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', PollSchema);