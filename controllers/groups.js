const Group = require('../models/Group');
const Thread = require('../models/Thread');




exports.createGroup = async (req, res, next) => {
    try {
        const { nom, description, type, permissions } = req.body;

        const group = await Group.create({
            nom,
            description,
            type,
            permissions,
            administrateurs: [req.user.id], 
            membres: [req.user.id]
        });
        const newThread=await Thread.create({ groupe: group._id });
        group.thread = newThread._id;
        await group.save();

        res.status(201).json({ success: true, data: group });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};




exports.getGroups = async (req, res, next) => {
    try {
        let query;

        
        const reqQuery = { ...req.query };

        
        
        if (!reqQuery.type) {
            query = Group.find({ type: { $ne: 'secret' } });
        } else {
            
            query = Group.find(reqQuery);
        }

        const groups = await query;

        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};




exports.joinGroup = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ success: false, error: 'Groupe non trouvé' });
        }

        
        if (group.membres.includes(req.user.id)) {
            return res.status(400).json({ success: false, error: 'Vous êtes déjà membre de ce groupe' });
        }

        
        

        
        group.membres.push(req.user.id);
        await group.save();

        res.status(200).json({
            success: true,
            data: group
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};