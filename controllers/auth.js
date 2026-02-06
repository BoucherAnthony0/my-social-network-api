const User = require('../models/User');




exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        
        const user = await User.create({
            nom,
            prenom,
            email,
            password,
            role
        });

        
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token
        });
    } catch (err) {
        
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Cet email existe déjà' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};




exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Veuillez fournir un email et un mot de passe' });
        }

        
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Identifiants invalides' });
        }

        
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Identifiants invalides' });
        }

        
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};