const User = require('../models/User');

// @desc    Inscrire un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Créer l'utilisateur
        const user = await User.create({
            nom,
            prenom,
            email,
            password,
            role
        });

        // Créer le token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token
        });
    } catch (err) {
        // Gestion erreur doublon email (Code 11000 chez MongoDB)
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Cet email existe déjà' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Valider email et mot de passe
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Veuillez fournir un email et un mot de passe' });
        }

        // Vérifier l'utilisateur (on inclut le password car "select: false" dans le modèle)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Identifiants invalides' });
        }

        // Vérifier si le mot de passe correspond
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Identifiants invalides' });
        }

        // Créer le token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};