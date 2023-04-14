const Joi = require("joi");

const createWishlistValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string().required(),
        products: Joi.array().items({
            productID: Joi.string(),
        }),
    });
    const validation = schema.validate(data);
    return validation;
};

const updateWishlistValidation = (data) => {
    const schema = Joi.object({
        userID: Joi.string(),
        products: Joi.array().items({
            productID: Joi.string(),
        }),
    });
    const validation = schema.validate(data);
    return validation;
};

module.exports = { createWishlistValidation, updateWishlistValidation };
