const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom de l'événement est requis"],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    lieu: {
        type: String,
        required: [true, 'Le lieu est requis']
    },
    photoCouverture: {
        type: String,
        default: 'default_event.jpg'
    },
    estPublic: { // "Choix de rendre son événement privé ou public"
        type: Boolean,
        default: true
    },
    groupeLie: { // Lien optionnel vers un groupe
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        required: false
    },
    organisateurs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    participants: [{ // "Un événement peut avoir une multitude de participants"
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    typesBillets: [{
        nom: { type: String, required: true }, // Ex: "VIP", "Standard"
        prix: { type: Number, required: true }, // Ex: 50
        quantite: { type: Number, required: true }, // Stock initial
        vendus: { type: Number, default: 0 } // Compteur de ventes
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);