const startupDebugger = require('debug')('app:startup');            // app:startup is a namespace given to the debug function at startup
const dbDebugger = require('debug')('app:db');

const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();

const genres = require('./routes/genres');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/genres', genres);

app.set('view engine', 'pug');
app.set('views', './views');


// Configuration
startupDebugger('Application name: '+ config.get('name'));
startupDebugger('Mail Server:' + config.get('mail.host'));
dbDebugger('Password:' + config.get('mail.password'));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))