const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    evenement: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    acheteur: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    typeBillet: { 
        type: String,
        required: true
    },
    infosAcheteur: { 
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