const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    evenement: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    acheteur: { // L'utilisateur connecté qui achète
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    typeBillet: { // Le nom du billet choisi (ex: "Pass VIP")
        type: String,
        required: true
    },
    infosAcheteur: { // Données spécifiques demandées par le cahier des charges
        nom: { type: String, required: true },
        prenom: { type: String, required: true },
        adresse: { type: String, required: true }
    },
    prixPaye: {
        type: Number,
        required: true
    },
    dateAchat: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', TicketSchema);