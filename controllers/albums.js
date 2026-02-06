const Album = require('../models/Album');
const Event = require('../models/Event');



exports.createAlbum = async (req, res) => {
    try {
        const { titre, eventId } = req.body;

        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        
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



exports.addPhoto = async (req, res) => {
    try {
        const { url } = req.body; 
        const album = await Album.findById(req.params.id);

        if (!album) {
            return res.status(404).json({ success: false, error: 'Album introuvable' });
        }

        
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