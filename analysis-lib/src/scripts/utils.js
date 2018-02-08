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

  'parseFieldByFieldReport': function(report) {

     let parsed = [];

     report.forEach(row => {

       let fields = JSON.parse(row['test_data_field_ids']);
       let values = JSON.parse(row['test_data_field_values']);

       let occurrence = {
         'criteriaId': row['criteria_id'],
         'dataRowId': row['test_data_row_id'],

         'fields': fields.map((name, i) => ({ 'name': name, 'value': values[i] }))
       };

       parsed.push(occurrence);

     });

     return parsed;

  },

  'fieldByFieldToTsv': function(report) {

    let filtersMeta = require('../filters/filters-meta');
    let explanationCriteria = 'userExplanation';
    let headers = ['dataRowId', 'criteriaId','description', 'fields'];

    let tsv = headers.join("\t");
    tsv += "\n";

    report.forEach(row => {

      let fields = JSON.parse(row['test_data_field_ids']);
      let values = JSON.parse(row['test_data_field_values']);

      let occurrence = [
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

  'rowByRowToTsv': function(report) {

    let filtersMeta = require('../filters/filters-meta');
    let explanationCriteria = 'userExplanation';
    let headers = ['rowId', 'errors', 'warnings', 'grade'];

    let tsv = headers.join('\t');
    tsv += '\n';

    // Mounts TSV tsv
    Object.keys(report).forEach(rowId => {

      let occurrence = report[rowId];
      let values = Object.keys(occurrence).map(key => occurrence[key]);

      tsv += values.join('\t');
      tsv += '\n';

    });

    return tsv;

  },

};
