// Packages
let fs = require('fs');
let readline = require('readline');
let stream = require('stream');
let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');

process.on('uncaughtException', (function(error) { return console.log(error.stack); }));

 // mongoose.set('debug, true');
 //
 // var configDB = require('../config/database.js');
 //
 // mongoose.connect(configDB.url);
 //
 // global.db = mongoose.connection;
 //
 // global.db.on('error', console.error.bind(console, 'DB connection error.'));
 //
 // global.db.once('open', console.log.bind(console, 'DB Connection established.'));

 app.use(cors());

 app.use(bodyParser.json());

 app.set('port', process.env.PORT || 3000);

 app.use(require('./api'));

 let server = app.listen(app.get('port'), function() {
   return console.log('Listening on port ' + app.get('port'));
 });
