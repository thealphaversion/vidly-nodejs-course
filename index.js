// const startupDebugger = require('debug')('app:startup');            // app:startup is a namespace given to the debug function at startup
// const dbDebugger = require('debug')('app:db');

require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();

process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { db: 'mongodb://localhost/vidly' });

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);        // 0 means success, anything oother than 0 is failure
}

mongoose.connect('mongodb://localhost/vidly').then(() => {
    console.log("Connected to mongo");
}).catch(() => {
    console.log('error in connection');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

app.set('view engine', 'pug');
app.set('views', './views');


// Configuration
// startupDebugger('Application name: '+ config.get('name'));
// startupDebugger('Mail Server:' + config.get('mail.host'));
// dbDebugger('Password:' + config.get('mail.password'));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))