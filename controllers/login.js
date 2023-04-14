const User = require("../models/Users");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const { loginValidation } = require("../validation/users");

const login = async (req, res) => {
    try {
        const validation = loginValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Please enter a valid username",
            });
        }

        const hashedPass = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET_PHRASE
        );
        const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json({
                success: false,
                msg: "Please enter a valid password",
            });
        }

        const accessToken = JWT.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_PHRASE,
            { expiresIn: "3h" }
        );

        return res
            .status(200)
            .json({ success: true, msg: "Login Successful", accessToken });
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = login;
