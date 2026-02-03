const mongoose = require('mongoose');

// Sous-schéma pour les commentaires sur une photo
const CommentaireSchema = new mongoose.Schema({
    auteur: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    texte: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Sous-schéma pour les photos
const PhotoSchema = new mongoose.Schema({
    url: { // On stockera l'URL de l'image (ex: "http://img.com/photo1.jpg")
        type: String,
        required: true
    },
    posteePar: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    commentaires: [CommentaireSchema] // "Ces photos peuvent être commentées"
});

// Schéma principal de l'Album
const AlbumSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, "L'album doit avoir un titre"],
        trim: true
    },
    evenement: { // "Un album photo est associé à 1 événement"
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true,
        unique: true // Un événement n'a qu'un seul album principal (simplification)
    },
    photos: [PhotoSchema], // "Contient 0 ou plusieurs photos"
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Album', AlbumSchema);