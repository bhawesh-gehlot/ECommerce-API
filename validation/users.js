const Joi = require("joi");

const createUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().min(3).max(50),
        email: Joi.string().required().min(5).max(256).email(),
        password: Joi.string().required().min(8).max(1024),
        name: Joi.string().required().min(2).max(256),
        contact: Joi.string().max(10),
        isAdmin: Joi.boolean(),
    });
    const validation = schema.validate(data);
    return validation;
};

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(8).max(1024),
    });
    const validation = schema.validate(data);
    return validation;
};

const updateUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50),
        email: Joi.string().min(5).max(256).email(),
        password: Joi.string().min(8).max(1024),
        name: Joi.string().min(2).max(256),
        contact: Joi.string().max(10),
        isAdmin: Joi.boolean(),
    });
    const validation = schema.validate(data);
    return validation;
};

module.exports = {
    createUserValidation,
    loginValidation,
    updateUserValidation,
};
