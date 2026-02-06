const Thread = require('../models/Thread');
const Message = require('../models/Message');



exports.postMessage = async (req, res, next) => {
    try {
        const { contenu } = req.body;
        const { threadId } = req.params;

        
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



exports.getMessages = async (req, res, next) => {
    try {
        
        const thread = await Thread.findOne({
            $or: [{ groupe: req.params.contextId }, { evenement: req.params.contextId }]
        });

        if (!thread) {
            return res.status(404).json({ success: false, error: 'Aucune discussion trouvée pour cet élément' });
        }

        const messages = await Message.find({ thread: thread._id })
            .populate('expediteur', 'nom prenom') 
            .sort({ createdAt: 1 }); 

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