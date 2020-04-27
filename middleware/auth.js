const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    // if we don't have a token
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // decoded is the object that we will get after the payload is decoded
        // we will put this in the request as a user object
        req.user = decoded;
        // so in our route handlers we can access req.user._id and so on

        // now we have to pass control to the next middleware function in the request processing pipeline, that is the route handler   
        // so we call the next
        next();
    } catch (ex) {
        // if token is invalid
        res.status(400).send('Invalid token.')
    }
}

module.exports = auth;