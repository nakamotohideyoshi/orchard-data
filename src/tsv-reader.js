
const csv = require('csv-streamify')
const fs = require('fs')

import { MAX_FIELDS } from './constants.js'

module.exports = function(sourceFile,lineReadHandler,errHandler){
    // future: a promise would be cleaner than a callback

    let header = null;
    const parser = csv({objectMode: true})

    parser.on('data', function (line) {
      var fields = (""+line).split("\t");
      if (fields.length > MAX_FIELDS)
        throw("Too many fields in line: "+fields.length)
      if (!header)
        header = fields
      else {
        lineReadHandler(fields)
      }
    })

    try {
      fs.createReadStream(sourceFile).pipe(parser)
    } catch(ex){
      errHandler(ex)
    }
}
