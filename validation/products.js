const Joi = require("joi");

const createProductValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3).max(1024),
        description: Joi.string().required().min(5).max(5000),
        price: Joi.number().required(),
        tags: Joi.array().required(),
        imgURL: Joi.string(),
        providedBy: Joi.string().required(),
    });
    const validation = schema.validate(data);
    return validation;
};

const updateProductValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(1024),
        description: Joi.string().min(5).max(5000),
        price: Joi.number(),
        tags: Joi.array(),
        imgURL: Joi.string(),
        providedBy: Joi.string(),
    });
    const validation = schema.validate(data);
    return validation;
};

module.exports = {
    createProductValidation,
    updateProductValidation,
};
