// Packages
let fs = require('fs');
let readline = require('readline');
let stream = require('stream');
let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');

process.on('uncaughtException', (function(error) { return console.log(error.stack); }));

app.use(cors());

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(require('./api'));

let server = app.listen(app.get('port'), function() {
  return console.log('Listening on port ' + app.get('port'));
});
