const Album = require('../models/Album');
const Event = require('../models/Event');

// @desc    Créer un album pour un événement
// @route   POST /api/albums
exports.createAlbum = async (req, res) => {
    try {
        const { titre, eventId } = req.body;

        // Vérifier si l'event existe
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        // Vérifier si l'user participe à l'event (Bonus sécurité)
        if (!event.participants.includes(req.user.id)) {
            return res.status(403).json({ success: false, error: 'Vous devez participer à l\'événement pour créer son album' });
        }

        const album = await Album.create({
            titre,
            evenement: eventId
        });

        res.status(201).json({ success: true, data: album });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Ajouter une photo dans l'album
// @route   POST /api/albums/:id/photos
exports.addPhoto = async (req, res) => {
    try {
        const { url } = req.body; // L'utilisateur envoie l'URL de l'image
        const album = await Album.findById(req.params.id);

        if (!album) {
            return res.status(404).json({ success: false, error: 'Album introuvable' });
        }

        // Ajout de la photo dans le tableau
        const newPhoto = {
            url,
            posteePar: req.user.id
        };

        album.photos.push(newPhoto);
        await album.save();

        res.status(200).json({ success: true, data: album });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};