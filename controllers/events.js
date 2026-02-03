const Event = require('../models/Event');
const Group = require('../models/Group');
const Thread = require('../models/Thread');

// @desc    Créer un événement
// @route   POST /api/events
// @access  Privé
exports.createEvent = async (req, res, next) => {
    try {
        const { nom, description, dateDebut, dateFin, lieu, estPublic, groupeId } = req.body;
        let participants = [req.user.id];
        let organisateurs = [req.user.id];

        
        if (groupeId) {
            const groupe = await Group.findById(groupeId);
            
            if (!groupe) {
                return res.status(404).json({ success: false, error: 'Groupe non trouvé' });
            }

            
            const estAdmin = groupe.administrateurs.includes(req.user.id);
            
            if (!estAdmin && !groupe.permissions.autoriserCreationEventMembre) {
                return res.status(403).json({ success: false, error: "Pas la permission de créer un événement ici" });
            }

            
            participants = [...groupe.membres];
        }

        
        const event = await Event.create({
            nom,
            description,
            dateDebut,
            dateFin,
            lieu,
            estPublic,
            groupeLie: groupeId || null,
            organisateurs,
            participants
        });
        await Thread.create({ evenement: event._id });
        res.status(201).json({
            success: true,
            data: event
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};