const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.token;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                status: "You are not a authorized user",
            });
        } else {
            const token = authHeader.split(" ")[1];
            JWT.verify(token, process.env.JWT_SECRET_PHRASE, (err, user) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ success: false, status: "Token not valid" });
                }
                req.user = user;
                next();
            });
        }
    } catch (error) {
        return res.status(400).json({ success: false, status: error });
    }
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(401).json({
                success: false,
                status: "You are not authorized to use this route",
            });
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
