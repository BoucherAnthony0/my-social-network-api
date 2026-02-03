const Thread = require('../models/Thread');
const Message = require('../models/Message');

// @desc    Poster un message dans un thread
// @route   POST /api/threads/:threadId/messages
exports.postMessage = async (req, res, next) => {
    try {
        const { contenu } = req.body;
        const { threadId } = req.params;

        // Vérifier si le thread existe
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ success: false, error: 'Discussion introuvable' });
        }

        const message = await Message.create({
            thread: threadId,
            expediteur: req.user.id,
            contenu
        });

        res.status(201).json({ success: true, data: message });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Lire les messages (via ID Groupe ou ID Event)
// @route   GET /api/threads/:contextId
exports.getMessages = async (req, res, next) => {
    try {
        // On cherche un thread lié soit au groupe, soit à l'event
        const thread = await Thread.findOne({
            $or: [{ groupe: req.params.contextId }, { evenement: req.params.contextId }]
        });

        if (!thread) {
            return res.status(404).json({ success: false, error: 'Aucune discussion trouvée pour cet élément' });
        }

        const messages = await Message.find({ thread: thread._id })
            .populate('expediteur', 'nom prenom') // On récupère les noms des gens
            .sort({ createdAt: 1 }); // Ordre chronologique

        res.status(200).json({
            success: true,
            threadId: thread._id,
            count: messages.length,
            data: messages
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};