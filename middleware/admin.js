const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // the auth middleware is executed before this
    // so it gives us the req.user object

    if (!req.user.isAdmin) {
        // 401: Unauthorised
        // 403: Forbidden

        return res.status(403).send('Access denied.');
    }

    next();
}