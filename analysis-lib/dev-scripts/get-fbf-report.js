let analysisLibModule = require('../analysis-lib-module');
let dbInterface = new analysisLibModule.dbInterface();
dbInterface.init();

let fbfReport = dbInterface.fetchFieldByFieldReport()
  .then(report => console.log(report));
