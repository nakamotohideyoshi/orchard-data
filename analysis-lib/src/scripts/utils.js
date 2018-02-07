module.exports = {

  'rowByRow': function(report) {

    // Row by Row Report
    let RBRReport = {};
    let filtersMeta = require("../filters/filters-meta");

    report.forEach(occurrence => {

      // Creates object
      if(!RBRReport[occurrence['test_data_row_id']]) {

        RBRReport[occurrence['test_data_row_id']] = {
          'rowID': occurrence['test_data_row_id'],
          'errors': 0,
          'warnings': 0,
          'grade': 'PASS'
        };

      }

      // warning or error
      let filterType = filtersMeta[occurrence['criteria_id']]['type'].toLowerCase();

      // pluralize
      if(filterType[filterType.length - 1] !== 's') { filterType += "s"; }

      // RBRReports
      RBRReport[occurrence['test_data_row_id']][filterType] += 1;

      if(RBRReport[occurrence['test_data_row_id']]['errors'] > 0) {

        RBRReport[occurrence['test_data_row_id']]['grade'] = 'ERROR';

      }

      else if(RBRReport[occurrence['test_data_row_id']]['warnings'] > 0) {

        RBRReport[occurrence['test_data_row_id']]['grade'] = 'WARNING';

      }

    });

    return RBRReport;

  },

};
