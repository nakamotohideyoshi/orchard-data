// Packages
let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let morgan = require('morgan')

process.on('uncaughtException', function (error) { return console.log(error.stack) })

if (process.env.NODE_ENV !== 'test') { app.use(morgan('combined')) }

app.use(cors())

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000)

app.use('/', require('./api'))

app.listen(app.get('port'), function () {
  return console.log('Listening on port ' + app.get('port'))
})
