const Joi = require("joi");

const createOrderValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string(),
        products: Joi.array().items({
            productID: Joi.string().required(),
            quantity: Joi.number(),
        }).required(),
        totalAmount: Joi.number(),
        discount: Joi.number(),
        finalAmount: Joi.number(),
        address: Joi.string().required(),
        status: Joi.string(),
    });
    const validation = schema.validate(data);
    return validation;
};

const updateOrderValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string(),
        products: Joi.array().items({
            productID: Joi.string(),
            quantity: Joi.number(),
        }),
        totalAmount: Joi.number(),
        discount: Joi.number(),
        finalAmount: Joi.number(),
        address: Joi.string(),
        status: Joi.string(),
    });
    const validation = schema.validate(data);
    return validation;
};

module.exports = { createOrderValidation, updateOrderValidation };
