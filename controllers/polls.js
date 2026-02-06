const Poll = require('../models/Poll');
const Event = require('../models/Event');



exports.createPoll = async (req, res) => {
    try {
        const { titre, eventId, questions } = req.body;

        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        
        if (!event.organisateurs.includes(req.user.id)) {
            return res.status(403).json({ success: false, error: "Seuls les organisateurs peuvent créer des sondages" });
        }

        
        const poll = await Poll.create({
            titre,
            evenement: eventId,
            creePar: req.user.id,
            questions 
        });

        res.status(201).json({ success: true, data: poll });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};



exports.votePoll = async (req, res) => {
    try {
        
        const { questionId, optionId } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (!poll) return res.status(404).json({ success: false, error: 'Sondage introuvable' });

        
        const question = poll.questions.id(questionId);
        if (!question) return res.status(404).json({ success: false, error: 'Question introuvable' });

        
        
        question.options.forEach(opt => {
            
            opt.votes = opt.votes.filter(userId => userId.toString() !== req.user.id);
        });

        
        const option = question.options.id(optionId);
        if (!option) return res.status(404).json({ success: false, error: 'Option invalide' });
        
        option.votes.push(req.user.id);

        await poll.save();

        res.status(200).json({ success: true, data: poll });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};