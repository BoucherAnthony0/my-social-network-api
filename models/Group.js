const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom du groupe est requis'],
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    icone: {
        type: String,
        default: 'default_icon.jpg' 
    },
    photoCouverture: {
        type: String,
        default: 'default_cover.jpg'
    },
    type: {
        type: String,
        enum: ['public', 'prive', 'secret'], 
        default: 'public'
    },
    permissions: {
        autoriserPublicationMembre: { 
            type: Boolean,
            default: true
        },
        autoriserCreationEventMembre: { 
            type: Boolean,
            default: false
        }
    },
    thread: {
        type: mongoose.Schema.ObjectId,
        ref: 'Thread'
    },
    administrateurs: [{ 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    membres: [{ 
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Group', GroupSchema);