require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.isAuthenticated = (req, res, next) => {
    const userId = req.headers.userid;
    const token = req.headers.authorization;
    if (!userId?.length > 0 || !token?.length > 0) {
        return res.json({ error: "sorry You are not a logged in user", authError: true });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
            if (error) {
                return res.json({ error: "sorry you are not logged in user", authError: true });
            } else {
                if (decoded.user._id === userId) {
                    req.user = decoded.user;
                    next();
                } else {
                    return res.json({ error: "sorry you are not logged in user", authError: true });
                }
            }
        });
    }
};
