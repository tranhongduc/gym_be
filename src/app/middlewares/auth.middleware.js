const db = require("../models/index");
const User = db.users;

const authMiddleware = {
    getAccessToken: (req, res, next) => {
        next();
    },
    verifyToken: (req, res, next) => {
        next();
    },
    checkAuth: (req, res, next) => {
        next();
    },
}

module.exports = authMiddleware;