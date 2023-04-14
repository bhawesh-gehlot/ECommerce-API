const Users = require("../models/Users");

const assignAdmin = async (req, res) => {
    try {
        const userId = req.body.userId;
        const assign = await Users.findByIdAndUpdate(
            userId,
            { $set: { isAdmin: true } },
            { new: true }
        );
        if (assign) {
            return res
                .status(200)
                .json({ success: true, msg: `User ${userId} is now Admin` });
        } else {
            return res
                .status(500)
                .json({
                    success: false,
                    msg: "Failed to assign user as admin",
                });
        }
    } catch (error) {
        return res.status(500).json({ success: false, status: error });
    }
};

module.exports = assignAdmin;
