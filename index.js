// const startupDebugger = require('debug')('app:startup');            // app:startup is a namespace given to the debug function at startup
// const dbDebugger = require('debug')('app:db');

const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logs')();          // we put this first so that incase we have any errors in loading other modules, they get logged here
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config');
require('./startup/validation')();
require('./startup/prod')(app);

app.set('view engine', 'pug');
app.set('views', './views');

// Configuration
// startupDebugger('Application name: '+ config.get('name'));
// startupDebugger('Mail Server:' + config.get('mail.host'));
// dbDebugger('Password:' + config.get('mail.password'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;