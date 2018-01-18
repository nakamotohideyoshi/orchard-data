tsv = require('./tsv-reader.js')
db = require('.db.js')

console.log("*** Debug.js ***")

var sourceFile = "tests/data/test.tsv"
var lineReadHandler = function(){
  console.log("line read handler")
}
var errHandler = function(){
  console.log("err handler")
}

tsv(sourceFile,lineReadHandler,errHandler);
