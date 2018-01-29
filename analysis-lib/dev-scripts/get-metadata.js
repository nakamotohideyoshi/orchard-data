let analysisLibModule = require('../analysis-lib-module');
let dbInterface = new analysisLibModule.dbInterface();
dbInterface.init();

let metadata = dbInterface.fetchDatasetMeta()
  .then(table => console.log(table));
