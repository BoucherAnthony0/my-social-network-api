const mongoose = require('mongoose');


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


const PhotoSchema = new mongoose.Schema({
    url: { 
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
    commentaires: [CommentaireSchema] 
});


const AlbumSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, "L'album doit avoir un titre"],
        trim: true
    },
    evenement: { 
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true,
        unique: true 
    },
    photos: [PhotoSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Album', AlbumSchema);