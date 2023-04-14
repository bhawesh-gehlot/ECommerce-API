const User = require("../models/Users");
const CryptoJS = require("crypto-js");
const { createUserValidation } = require("../validation/users");

const { createWishlist } = require("./wishlist");
const { createCart } = require("./cart");

const register = async (req, res) => {
    try {
        const validation = createUserValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const duplicateUsernameCheck = await User.findOne({
            username: req.body.username,
        });
        if (duplicateUsernameCheck) {
            return res.status(400).json({
                msg: "username already exists. Please enter a new username",
            });
        }

        const duplicateEmailCheck = await User.findOne({
            email: req.body.email,
        });
        if (duplicateEmailCheck) {
            return res.status(400).json({
                msg: "email already exists. Please login to continue or use different email.",
            });
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASSWORD_SECRET_PHRASE
            ).toString(),
            name: req.body.name,
            contact: req.body.contact,
        });
        const savedUser = await newUser.save();

        if (createWishlist(savedUser._id) && createCart(savedUser._id)) {
            return res.status(201).json({
                success: true,
                msg: "User created successfully. Please login to continue.",
            });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Some error occured" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = register;
