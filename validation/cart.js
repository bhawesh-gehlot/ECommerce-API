const Joi = require("joi");

const createCartValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string().required(),
        products: Joi.array().items({
            productID: Joi.string().required(),
            quantity: Joi.number(),
        }),
    });
    const validation = schema.validate(data);
    return validation;
};

const updateCartValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string(),
        products: Joi.array().items(
            {
                productID: Joi.string(),
                quantity: Joi.number(),
            },
        ),
    });
    const validation = schema.validate(data);
    return validation;
};

module.exports = { createCartValidation, updateCartValidation };
