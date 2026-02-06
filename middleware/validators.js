const Joi = require('joi');

exports.validateEvent = (req, res, next) => {
    const schema = Joi.object({
        nom: Joi.string().trim().required().messages({
            'string.empty': 'Le nom est obligatoire'
        }),
        description: Joi.string().required(),
        lieu: Joi.string().required(),
        
        dateDebut: Joi.date().iso().required(),
        dateFin: Joi.date().iso().greater(Joi.ref('dateDebut')).required().messages({
            'date.greater': 'La date de fin doit être après la date de début'
        }),
        estPublic: Joi.boolean(),
        
        groupeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('ID de groupe invalide')
    });

    
    const { error } = schema.validate(req.body);

    if (error) {
        
        return res.status(400).json({ 
            success: false, 
            error: error.details[0].message 
        });
    }

    next(); 
};