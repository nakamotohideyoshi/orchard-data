// Check Various Artists on Track Levels
module.exports = function(row) {
  var argv = require('minimist')(process.argv.slice(2));
  var reportToolModule = require('../scripts/report_tool');
  var reportTool = new reportToolModule();

  // retrieves filter description
  var description = require('./filters_desc')['filter1'];

  // Retrieves filename
  var inputFile = argv['input'];

  // Converts to lowercase and removes whitespaces
  var trackArtist = row['Track Artist'];
  trackArtist = trackArtist.toLowerCase().trim().replace(' ', '')

  // if filter applies
  if(trackArtist === 'variousartists') {
    reportTool.filename = inputFile;

    Object.keys(description).forEach(key => reportTool[key] = description[key]);

    console.log(reportTool);
  }

  console.log("olar fora");
  return true;
}
