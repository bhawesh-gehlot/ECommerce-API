const Wishlist = require("../models/Wishlist");
const { updateWishlistValidation } = require("../validation/wishlist");
const { matchElements } = require("./match");

const createWishlist = async (userid) => {
    try {
        const newWishlist = new Wishlist({ userID: userid, products: [] });

        const saveWishlist = await newWishlist.save();
        if (saveWishlist) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return error;
    }
};

const updateWishlist = async (req, res) => {
    try {
        const validation = updateWishlistValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const updatedWishlist = await Wishlist.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (updatedWishlist) {
            return res
                .status(200)
                .json({ success: true, products: updatedWishlist.products });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const addProductToWishlist = async (req, res) => {
    try {
        const userWishlist = await Wishlist.findOne({ userID: req.user.id });
        if (!userWishlist) {
            return res.status(500).json({
                success: false,
                msg: "Some error occurred. Please try again.",
            });
        }

        if (
            userWishlist.products.some(
                (prodID) => prodID.productID === req.body.products[0].productID
            )
        ) {
            return res.status(400).json({
                success: false,
                msg: "Product already exists in Wishlist",
            });
        }

        const addProd = await Wishlist.updateOne(
            { _id: userWishlist._id },
            { $push: req.body }
        );
        if (addProd) {
            return res.status(200).json({
                success: true,
                msg: "Products added to Wishlist successfully",
            });
        }
        return res.status(500).json({
            success: false,
            msg: "Failed to add products to Wishlist",
        });
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const removeProductFromWishlist = async (req, res) => {
    try {
        const userWishlist = await Wishlist.findOne({ userID: req.user.id });
        if (!userWishlist) {
            return res.status(500).json({
                success: false,
                msg: "Some error occurred. Please try again.",
            });
        }

        if (!userWishlist.products[0]) {
            return res.status(404).json({
                success: false,
                msg: "Your Wishlist is empty.",
            });
        }
        if (matchElements(userWishlist.products, req.body.productID)) {
            const removeProd = await Wishlist.updateOne(
                { _id: userWishlist._id },
                { $pull: { products: { productID: req.body.productID } } }
            );
            if (removeProd) {
                return res.status(200).json({
                    success: true,
                    msg: "Products removed from Wishlist successfully.",
                });
            }
            return res.status(500).json({
                success: false,
                msg: "Unable to remove product from wishlist.",
            });
        } else {
            return res.status(404).json({
                success: false,
                msg: "Product does not exist in Wishlist.",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userID: req.user.id });
        if (wishlist) {
            return res
                .status(200)
                .json({ success: true, products: wishlist.products });
        } else {
            return res.status(500).json({
                success: false,
                status: "Some error occurred. Please try again.",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

// Get Wishlist of all users
const getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find();
        if (wishlists) {
            return res
                .status(200)
                .json({ success: true, wishlists: wishlists });
        } else {
            return res.status(404).json({
                success: false,
                status: "No Wishlist found in database",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const emptyWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userID: req.user.id });
        const empWishlist = await Wishlist.findByIdAndUpdate(
            wishlist.id,
            {
                $set: { products: [] },
            },
            { new: true }
        );
        if (empWishlist) {
            return res.status(200).json({
                success: true,
                status: "All products removed from wishlist successfully.",
            });
        } else {
            return res
                .status(500)
                .json({ success: false, status: "Unable to empty wishlist" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = {
    createWishlist,
    updateWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    getWishlist,
    getAllWishlists,
    emptyWishlist,
};
