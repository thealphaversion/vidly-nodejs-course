const winston = require('winston');

module.exports = function(err, req, res, next) {
    winston.log();

    // we use 500 => internal server error
    // to signify something failed on the server
    response.status(500).send('A failure occured');
}