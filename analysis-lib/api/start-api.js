// Packages
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

if (process.env.NODE_ENV !== 'test') { app.use(morgan('combined')) }
app.use(cors())
app.use(bodyParser.json())

const startAPI = async function () {
  const THRESHOLD = 100 // number of tries
  const IPORT = 3000 // initial port
  const SUCCESS = 'SUCCESS'

  console.log('CONNECTING')

  for (let i = 0; i < THRESHOLD; i++) {
    const port = IPORT + i
    console.log(`Trying port ${port}`)

    const result = await new Promise((resolve) => {
      app.use('/', require('./api'))
      app.listen(port)
        .on('listening', () => resolve(SUCCESS))
        .on('error', (err) => resolve(err))
    })

    if (result.name === 'Error') {
      // if it's a problem of port in use, tries a new one
      // otherwise, returns error to user
      if (result.code === 'EADDRINUSE') {
        console.log(`Port ${port} is taken. Trying a new one...`)
        continue
      } else return result
    } else if (result === SUCCESS) return port
  }

  return new Error(`Ports ${IPORT} - ${IPORT + THRESHOLD - 1} are taken`)
}

module.exports = startAPI
