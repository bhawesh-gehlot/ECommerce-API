const Cart = require("../models/Cart");
const { updateCartValidation } = require("../validation/cart");
const { matchElements } = require("./match");

const createCart = async (userid) => {
    try {
        const newCart = new Cart({ userID: userid, products: [] });

        const saveCart = await newCart.save();
        if (saveCart) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
};

const updateCart = async (req, res) => {
    try {
        const validation = updateCartValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (updatedCart) {
            const { _id, userID, createdAt, updatedAt, __v, ...data } =
                updatedCart._doc;
            return res.status(200).json({ success: true, data });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Failed to update cart." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userID: req.user.id });

        if (
            userCart.products.some(
                (product) =>
                    product.productID === req.body.products[0].productID
            )
        ) {
            let orgQty = 0;
            for (let i = 0; i < userCart.products.length; i++) {
                if (
                    userCart.products[i].productID ===
                    req.body.products[0].productID
                ) {
                    orgQty = userCart.products[i].quantity;
                }
            }
            const updateCart = await Cart.findOneAndUpdate(
                {
                    _id: userCart._id,
                    "products.productID": req.body.products[0].productID,
                },
                {
                    $set: {
                        "products.$.quantity":
                            orgQty + req.body.products[0].quantity,
                    },
                }
            );
            return res.status(200).json({
                success: true,
                msg: `${req.body.products[0].quantity} More Quantity of the product added to the cart successfully`,
            });
        } else {
            const addProd = await Cart.updateOne(
                { _id: userCart._id },
                { $push: req.body }
            );
            if (addProd) {
                return res.status(200).json({
                    success: true,
                    msg: "Products added to cart successfully",
                });
            } else {
                return res.status(500).json({
                    success: false,
                    msg: "Failed to add products to cart.",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userID: req.user.id });

        if (!userCart.products[0]) {
            return res
                .status(400)
                .json({ success: false, msg: "Your Cart is already empty" });
        }
        if (matchElements(userCart.products, req.body.productID)) {
            const removeProd = await Cart.updateOne(
                { _id: userCart._id },
                { $pull: { products: { productID: req.body.productID } } }
            );
            return res.status(200).json({
                success: true,
                msg: "Products removed from cart successfully",
            });
        } else {
            return res.status(404).json({
                success: false,
                msg: "Product does not exist in cart",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userID: req.user.id });
        if (cart) {
            return res.status(200).json({ success: true, data: cart.products });
        } else {
            return res
                .status(404)
                .json({ success: false, status: "You do not have any Cart" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

// Get carts of all users
const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        if (carts) {
            return res.status(200).json({ success: true, carts });
        } else {
            return res.status(404).json({
                success: false,
                status: "No Cart present in database",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const emptyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userID: req.user.id });
        const empCart = await Cart.findByIdAndUpdate(
            cart.id,
            {
                $set: { products: [] },
            },
            { new: true }
        );
        if (empCart) {
            return res
                .status(200)
                .json({ success: true, status: "Cart is now empty" });
        } else {
            return res
                .status(500)
                .json({ success: false, status: "Unable to empty Cart" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = {
    createCart,
    updateCart,
    addProductToCart,
    removeProductFromCart,
    getCart,
    getAllCarts,
    emptyCart,
};
