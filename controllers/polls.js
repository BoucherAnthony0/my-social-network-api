const Poll = require('../models/Poll');
const Event = require('../models/Event');

// @desc    Créer un sondage pour un événement
// @route   POST /api/polls
exports.createPoll = async (req, res) => {
    try {
        const { titre, eventId, questions } = req.body;

        // 1. Vérifier l'événement
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        // 2. Vérifier que c'est bien un organisateur qui crée le sondage
        if (!event.organisateurs.includes(req.user.id)) {
            return res.status(403).json({ success: false, error: "Seuls les organisateurs peuvent créer des sondages" });
        }

        // 3. Création
        const poll = await Poll.create({
            titre,
            evenement: eventId,
            creePar: req.user.id,
            questions // On s'attend à recevoir un tableau d'objets bien formaté
        });

        res.status(201).json({ success: true, data: poll });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Voter pour une question spécifique
// @route   POST /api/polls/:id/vote
exports.votePoll = async (req, res) => {
    try {
        // questionId = ID de la question, optionId = ID de la réponse choisie
        const { questionId, optionId } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (!poll) return res.status(404).json({ success: false, error: 'Sondage introuvable' });

        // Trouver la question dans le sondage
        const question = poll.questions.id(questionId);
        if (!question) return res.status(404).json({ success: false, error: 'Question introuvable' });

        // LOGIQUE : "Uniquement 1 réponse peut être choisie"
        // 1. On retire le vote de l'utilisateur de TOUTES les options de cette question (nettoyage)
        question.options.forEach(opt => {
            // On filtre pour garder tous les IDs SAUF celui de l'user
            opt.votes = opt.votes.filter(userId => userId.toString() !== req.user.id);
        });

        // 2. On ajoute le vote sur la bonne option
        const option = question.options.id(optionId);
        if (!option) return res.status(404).json({ success: false, error: 'Option invalide' });
        
        option.votes.push(req.user.id);

        await poll.save();

        res.status(200).json({ success: true, data: poll });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};