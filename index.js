// const startupDebugger = require('debug')('app:startup');            // app:startup is a namespace given to the debug function at startup
// const dbDebugger = require('debug')('app:db');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

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

app.set('view engine', 'pug');
app.set('views', './views');


// Configuration
// startupDebugger('Application name: '+ config.get('name'));
// startupDebugger('Mail Server:' + config.get('mail.host'));
// dbDebugger('Password:' + config.get('mail.password'));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))