const Group = require('../models/Group');
const Thread = require('../models/Thread');

// @desc    Créer un nouveau groupe
// @route   POST /api/groups
// @access  Privé (Besoin du Token)
exports.createGroup = async (req, res, next) => {
    try {
        // On récupère les infos envoyées
        const { nom, description, type, permissions } = req.body;

        // On crée le groupe en ajoutant l'utilisateur connecté comme Admin et Membre
        const group = await Group.create({
            nom,
            description,
            type,
            permissions,
            administrateurs: [req.user.id], // L'ID vient du middleware 'protect'
            membres: [req.user.id]
        });
        await Thread.create({ groupe: group._id });

        res.status(201).json({ success: true, data: group });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Lister tous les groupes (Publics uniquement pour l'instant)
// @route   GET /api/groups
// @access  Public
exports.getGroups = async (req, res, next) => {
    try {
        let query;

        // Copie de req.query (les paramètres d'URL)
        const reqQuery = { ...req.query };

        // Logique de filtrage
        // Par défaut, on exclut les groupes secrets si aucun type n'est précisé
        if (!reqQuery.type) {
            query = Group.find({ type: { $ne: 'secret' } });
        } else {
            // Sinon on cherche exactement le type demandé (ex: ?type=public)
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

// @desc    Rejoindre un groupe
// @route   POST /api/groups/:id/join
// @access  Privé
exports.joinGroup = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ success: false, error: 'Groupe non trouvé' });
        }

        // Vérifier si l'utilisateur est déjà membre
        if (group.membres.includes(req.user.id)) {
            return res.status(400).json({ success: false, error: 'Vous êtes déjà membre de ce groupe' });
        }

        // TODO (Bonus): Si le groupe est "privé", on pourrait demander une validation d'un admin.
        // Pour l'instant (KISS), on autorise l'ajout direct.

        // Ajouter l'utilisateur aux membres
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