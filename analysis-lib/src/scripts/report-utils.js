module.exports = {

  'rowByRow': function(report, datasetSize, category) {

    const filtersMeta = require("../filters/filters-meta");
    const dbInterfaceModule = require('../db-scripts/db-interface');
    const dbInterface = new dbInterfaceModule();

    const RBRReport = {};

    // Initializes empty report
    for(let i = 1; i <= datasetSize; i++) {

      RBRReport[i] = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS'
      };

    }

    for(let i = 0; i < report.length; i++) {

      const occurrence = report[i];
      let errors = [];

      if(category && filtersMeta[occurrence['criteria_id']]['category'].toLowerCase() !== category) { continue; }

      if (typeof occurrence['test_data_field_error_types'] === 'string') {
        errors = JSON.parse(occurrence['test_data_field_error_types']);
      } else if (occurrence['test_data_field_error_types'] instanceof Array) {
        errors = occurrence['test_data_field_error_types'];
      }

      errors.forEach(error => {

        // pluralize
        if(error[error.length - 1] !== 's') { error += "s"; }

        // increments error type
        RBRReport[occurrence['test_data_row_id']][error] += 1;

      });


      if(RBRReport[occurrence['test_data_row_id']]['errors'] > 0) {

        RBRReport[occurrence['test_data_row_id']]['grade'] = 'ERROR';

      }

      else if(RBRReport[occurrence['test_data_row_id']]['warnings'] > 0) {

        RBRReport[occurrence['test_data_row_id']]['grade'] = 'WARNING';

      }

    }

    reportArray = Object.keys(RBRReport).map(key => RBRReport[key]);
    reportArray.sort((a, b) => {

      const a_Problems = a['errors'] + a['warnings'];
      const b_Problems = b['errors'] + b['warnings'];

      return b_Problems - a_Problems || b['errors'] - a['errors'];

    });

    return reportArray;

  },

  'rowByRowToTsv': function(report) {

    const headers = ['rowId', 'errors', 'warnings', 'grade'];

    let tsv = headers.join('\t');
    tsv += '\n';

    // Mounts TSV tsv
    report.forEach(occurrence => {

      const values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    return tsv;

  },

  'errorByError': function(report, category) {

    // Row by Row Report
    const EBEReport = {};
    const filtersMeta = require("../filters/filters-meta");
    const explanationCriteria = 'userExplanation';

    let allFilters = Object.keys(filtersMeta);

    // Filters by category if any
    if(category) { allFilters = allFilters.filter(filterId => filtersMeta[filterId]['category'].toLowerCase() === category) }

    allFilters.forEach(filterId => {

      EBEReport[filterId] = {
        'count': 0,
        'criteriaId': filterId,
        'description': filtersMeta[filterId][explanationCriteria]
      };

    });


    report.forEach(occurrence => {

      const filterId = occurrence['criteria_id'];
      // If occurrence is of the chosen category
      if(allFilters.indexOf(filterId) !== -1) { EBEReport[filterId]['count'] += 1; }

    });

    reportArray = Object.keys(EBEReport).map(key => EBEReport[key]);
    reportArray.sort((a,b) => b['count'] - a['count']);

    return reportArray;

  },

  'errorByErrorToTsv': function(report) {

    const headers = ['count', 'criteriaId', 'description'];

    let tsv = headers.join('\t');
    tsv += '\n';

    // Mounts TSV tsv
    report.forEach(occurrence => {

      const values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    return tsv;

  },

  'parseFieldByFieldReport': function(report, datasetSize) {

     const parsed = [];
     report.forEach(row => {

       const fields = JSON.parse(row['test_data_field_ids']);
       const values = JSON.parse(row['test_data_field_values']);

       const occurrence = {
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

    const filtersMeta = require('../filters/filters-meta');
    const explanationCriteria = 'userExplanation';
    const headers = ['datasetSize', 'dataRowId', 'criteriaId','description', 'fields'];

    let tsv = headers.join("\t");
    tsv += "\n";

    report.forEach(row => {

      const fields = JSON.parse(row['test_data_field_ids']);
      const values = JSON.parse(row['test_data_field_values']);

      const occurrence = [
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
