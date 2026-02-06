const Ticket = require('../models/Ticket');
const Event = require('../models/Event');



exports.addTicketTypes = async (req, res) => {
    try {
        const { eventId, types } = req.body; 

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, error: 'Événement introuvable' });

        
        if (!event.organisateurs.includes(req.user.id)) {
            return res.status(403).json({ success: false, error: 'Non autorisé' });
        }

        
        event.typesBillets.push(...types);
        await event.save();

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};



exports.buyTicket = async (req, res) => {
    try {
        
        const { eventId, typeNom, nom, prenom, adresse } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, error: 'Événement introuvable' });

        
        const ticketType = event.typesBillets.find(t => t.nom === typeNom);

        if (!ticketType) {
            return res.status(404).json({ success: false, error: 'Ce type de billet n\'existe pas' });
        }

        
        if (ticketType.vendus >= ticketType.quantite) {
            return res.status(400).json({ success: false, error: 'Ce type de billet est épuisé' });
        }

        
        
        const existingTicket = await Ticket.findOne({ evenement: eventId, acheteur: req.user.id });
        if (existingTicket) {
            return res.status(400).json({ success: false, error: 'Vous avez déjà acheté un billet pour cet événement' });
        }

        
        const ticket = await Ticket.create({
            evenement: eventId,
            acheteur: req.user.id,
            typeBillet: typeNom,
            infosAcheteur: { nom, prenom, adresse },
            prixPaye: ticketType.prix
        });

        
        ticketType.vendus += 1;
        await event.save();

        res.status(201).json({ success: true, data: ticket });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};