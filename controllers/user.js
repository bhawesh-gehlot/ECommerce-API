const Users = require("../models/Users");
const { updateUserValidation } = require("../validation/users");

const updateUserDetails = async (req, res) => {
    try {
        const validation = updateUserValidation(req.body);
        const valError = validation.error;
        if (valError) {
            return res
                .status(400)
                .json({ success: false, msg: valError.details[0].message });
        }

        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASSWORD_SECRET_PHRASE
            ).toString();
        }
        if (req.body.isAdmin) {
            return res.status(403).json({
                success: false,
                status: "You cannot change your access level.",
            });
        }

        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id,
            { $set: req.body },
            { new: true }
        );
        const { _id, password, isAdmin, createdAt, updatedAt, __v, ...data } =
            updatedUser._doc;
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        if (user) {
            const {
                _id,
                password,
                isAdmin,
                createdAt,
                updatedAt,
                __v,
                ...data
            } = user._doc;
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(500).json({
                success: false,
                status: "Failed to fetch user details.",
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = req.query.new;
        const users = query
            ? await Users.find()
                  .sort({ createdAt: -1 })
                  .limit(req.query.limit ? req.query.limit : 5)
            : await Users.find();

        if (users) {
            return res.status(200).json({ success: true, users });
        } else {
            return res
                .status(404)
                .json({ success: false, status: "No users found in database" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const delUser = await Users.findByIdAndDelete(req.user.id);
        if (delUser) {
            return res.status(200).json({
                success: true,
                status: "User have been deleted successfully",
            });
        } else {
            return res
                .status(500)
                .json({ success: false, status: "Failed to delete user" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = { updateUserDetails, getUser, getAllUsers, deleteUser };
