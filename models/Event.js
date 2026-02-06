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
    estPublic: { 
        type: Boolean,
        default: true
    },
    groupeLie: { 
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        required: false
    },
    organisateurs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    participants: [{ 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    typesBillets: [{
        nom: { type: String, required: true }, 
        prix: { type: Number, required: true }, 
        quantite: { type: Number, required: true }, 
        vendus: { type: Number, default: 0 } 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);