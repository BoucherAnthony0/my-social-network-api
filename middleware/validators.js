const Joi = require('joi');

exports.validateEvent = (req, res, next) => {
    const schema = Joi.object({
        nom: Joi.string().trim().required().messages({
            'string.empty': 'Le nom est obligatoire'
        }),
        description: Joi.string().required(),
        lieu: Joi.string().required(),
        // Validation des dates : dateFin doit être supérieure à dateDebut
        dateDebut: Joi.date().iso().required(),
        dateFin: Joi.date().iso().greater(Joi.ref('dateDebut')).required().messages({
            'date.greater': 'La date de fin doit être après la date de début'
        }),
        estPublic: Joi.boolean(),
        // On autorise un ID de groupe s'il est présent
        groupeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('ID de groupe invalide')
    });

    // Vérification
    const { error } = schema.validate(req.body);

    if (error) {
        // Si erreur, on bloque tout de suite avec un 400 Bad Request
        return res.status(400).json({ 
            success: false, 
            error: error.details[0].message 
        });
    }

    next(); // Si tout est bon, on passe au contrôleur
};