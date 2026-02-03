const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

// @desc    L'organisateur ajoute des types de billets à son événement
// @route   POST /api/tickets/setup
exports.addTicketTypes = async (req, res) => {
    try {
        const { eventId, types } = req.body; // types = [{nom: "VIP", prix: 50, quantite: 100}]

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, error: 'Événement introuvable' });

        // Vérif : seul l'organisateur peut faire ça
        if (!event.organisateurs.includes(req.user.id)) {
            return res.status(403).json({ success: false, error: 'Non autorisé' });
        }

        // On ajoute les types de billets
        event.typesBillets.push(...types);
        await event.save();

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Acheter un billet
// @route   POST /api/tickets/buy
exports.buyTicket = async (req, res) => {
    try {
        // typeNom = "Pass VIP"
        const { eventId, typeNom, nom, prenom, adresse } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, error: 'Événement introuvable' });

        // 1. Trouver le type de billet demandé
        const ticketType = event.typesBillets.find(t => t.nom === typeNom);

        if (!ticketType) {
            return res.status(404).json({ success: false, error: 'Ce type de billet n\'existe pas' });
        }

        // 2. Vérifier le stock
        if (ticketType.vendus >= ticketType.quantite) {
            return res.status(400).json({ success: false, error: 'Ce type de billet est épuisé' });
        }

        // 3. Vérifier la limite "1 seul billet par personne extérieure" (Cahier des charges)
        // On cherche si cet user a déjà un ticket pour cet event
        const existingTicket = await Ticket.findOne({ evenement: eventId, acheteur: req.user.id });
        if (existingTicket) {
            return res.status(400).json({ success: false, error: 'Vous avez déjà acheté un billet pour cet événement' });
        }

        // 4. Créer le ticket
        const ticket = await Ticket.create({
            evenement: eventId,
            acheteur: req.user.id,
            typeBillet: typeNom,
            infosAcheteur: { nom, prenom, adresse },
            prixPaye: ticketType.prix
        });

        // 5. Mettre à jour le stock
        ticketType.vendus += 1;
        await event.save();

        res.status(201).json({ success: true, data: ticket });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};