const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Vérifier si le header Authorization contient un token "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // On récupère juste le code après "Bearer"
    }

    // 2. Si pas de token, on bloque
    if (!token) {
        return res.status(401).json({ success: false, error: 'Accès non autorisé (Token manquant)' });
    }

    try {
        // 3. Vérifier le token (Décryptage)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Ajouter l'utilisateur à la requête (req.user) pour l'utiliser dans les contrôleurs
        req.user = await User.findById(decoded.id);

        next(); // On passe à la suite
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Accès non autorisé (Token invalide)' });
    }
};