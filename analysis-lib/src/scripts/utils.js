module.exports = {

  'rowByRow': function(report, datasetSize) {

    let filtersMeta = require("../filters/filters-meta");
    let dbInterfaceModule = require('../db-scripts/db-interface');
    let dbInterface = new dbInterfaceModule();

    let RBRReport = {};

    // Initializes empty report
    for(let i = 0; i <= datasetSize; i++) {

      RBRReport[i] = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS'
      };

    }

    report.forEach(occurrence => {

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

    reportArray = Object.keys(RBRReport).map(key => RBRReport[key]);
    reportArray.sort((a, b) => {

      let a_Problems = a['errors'] + a['warnings'];
      let b_Problems = b['errors'] + b['warnings'];

      return b_Problems - a_Problems || b['errors'] - a['errors'];

    });

    return reportArray;

  },

  'rowByRowToTsv': function(report) {

    let headers = ['rowId', 'errors', 'warnings', 'grade'];

    let tsv = headers.join('\t');
    tsv += '\n';

    // Mounts TSV tsv
    report.forEach(occurrence => {

      let values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    return tsv;

  },

  'errorByError': function(report) {

    // Row by Row Report
    let EBEReport = {};
    let filtersMeta = require("../filters/filters-meta");
    let explanationCriteria = 'userExplanation';

    // Creates JSON for each possible error
    Object.keys(filtersMeta).forEach(filterId => {

      EBEReport[filterId] = {
        'count': 0,
        'criteriaId': filterId,
        'description': filtersMeta[filterId][explanationCriteria]
      };

    });

    report.forEach(occurrence => {

      let filterId = occurrence['criteria_id'];

      EBEReport[filterId]['count'] += 1;

    });

    reportArray = Object.keys(EBEReport).map(key => EBEReport[key]);
    reportArray.sort((a,b) => b['count'] - a['count']);

    return reportArray;

  },

  'errorByErrorToTsv': function(report) {

    let headers = ['criteriaId', 'description', 'count'];

    let tsv = headers.join('\t');
    tsv += '\n';

    // Mounts TSV tsv
    report.forEach(occurrence => {

      let values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    return tsv;

  },

  'parseFieldByFieldReport': function(report, datasetSize) {

     let parsed = [];
     report.forEach(row => {

       let fields = JSON.parse(row['test_data_field_ids']);
       let values = JSON.parse(row['test_data_field_values']);

       let occurrence = {
         'size': datasetSize,
         'criteria': row['criteria_id'],
         'id': row['test_data_row_id'],

         'fields': fields.map((name, i) => ({ 'name': name, 'value': values[i] }))
       };

       parsed.push(occurrence);

     });

     return parsed;

  },

  'fieldByFieldToTsv': function(report, datasetSize) {

    let filtersMeta = require('../filters/filters-meta');
    let explanationCriteria = 'userExplanation';
    let headers = ['datasetSize', 'dataRowId', 'criteriaId','description', 'fields'];

    let tsv = headers.join("\t");
    tsv += "\n";

    report.forEach(row => {

      let fields = JSON.parse(row['test_data_field_ids']);
      let values = JSON.parse(row['test_data_field_values']);

      let occurrence = [
        datasetSize,
        row['test_data_row_id'],
        row['criteria_id'],
        filtersMeta[row['criteria_id']][explanationCriteria],
        JSON.stringify(fields.map((name, i) => ({ 'name': name, 'value': values[i] })))
      ];

      tsv += occurrence.join("\t");
      tsv += "\n";

    });

    return tsv;

  },

};
