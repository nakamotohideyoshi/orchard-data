const stats = require('stats-analysis')

module.exports = {

  'rowByRow': function (report, datasetSize, category) {
    const filtersMeta = require('../filters/filters-meta')

    const RBRReport = {}

    // Initializes empty report
    for (let i = 1; i <= datasetSize; i++) {
      RBRReport[i] = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS',
        'acceptability': 'GREEN'
      }
    }

    for (let i = 0; i < report.length; i++) {
      const occurrence = report[i]
      let errors = []

      if (category && filtersMeta[occurrence['criteria_id']]['category'].toLowerCase() !== category) { continue }

      if (typeof occurrence['test_data_field_error_types'] === 'string') {
        errors = JSON.parse(occurrence['test_data_field_error_types'])
      } else if (occurrence['test_data_field_error_types'] instanceof Array) {
        errors = occurrence['test_data_field_error_types']
      }

      errors.forEach(error => {
        // pluralize
        if (error[error.length - 1] !== 's') { error += 's' }

        // increments error type
        RBRReport[occurrence['test_data_row_id']][error] += 1
      })

      if (RBRReport[occurrence['test_data_row_id']]['errors'] > 0) {
        RBRReport[occurrence['test_data_row_id']]['grade'] = 'ERROR'
      } else if (RBRReport[occurrence['test_data_row_id']]['warnings'] > 0) {
        RBRReport[occurrence['test_data_row_id']]['grade'] = 'WARNING'
      }
    }

    let reportArray = Object.keys(RBRReport).map(key => RBRReport[key])
    reportArray.sort((a, b) => {
      const aProblems = a['errors'] + a['warnings']
      const bProblems = b['errors'] + b['warnings']

      return bProblems - aProblems || b['errors'] - a['errors']
    })

    let errorScorePerRow = []

    reportArray.forEach(RBRReport => {
      let errorScore = RBRReport.errors + RBRReport.warnings * 0.5
      RBRReport.errorScore = errorScore
      errorScorePerRow.push(errorScore)
    })

    let standardDeviation = stats.stdev(errorScorePerRow)
    let mean = stats.mean(errorScorePerRow)
    let errorScoreBelowMean = mean - 0.5 * standardDeviation
    let errorScoreAboveMean = mean + 0.5 * standardDeviation

    reportArray.forEach(RBRReport => {
      if (RBRReport.errorScore < errorScoreBelowMean) {
        RBRReport.acceptability = 'GREEN'
      } else if (RBRReport.errorScore > errorScoreAboveMean) {
        RBRReport.acceptability = 'RED'
      } else {
        RBRReport.acceptability = 'YELLOW'
      }

      delete RBRReport.errorScore
    })

    return reportArray
  },

  'rowByRowToTsv': function (report) {
    const headers = ['rowId', 'errors', 'warnings', 'grade', 'acceptability']

    let tsv = headers.join('\t')
    tsv += '\n'

    // Mounts TSV tsv
    report.forEach(occurrence => {
      const values = Object.keys(occurrence).map(key => occurrence[key])

      tsv += values.join('\t')
      tsv += '\n'
    })

    return tsv
  },

  'errorByError': function (report, category) {
    // Row by Row Report
    const EBEReport = {}
    const filtersMeta = require('../filters/filters-meta')

    let allFilters = Object.keys(filtersMeta)

    // Filters by category if any
    if (category) { allFilters = allFilters.filter(filterId => filtersMeta[filterId]['category'].toLowerCase() === category) }

    allFilters.forEach(filterId => {
      const explanationsKeys = Object.keys(filtersMeta[filterId].explanations)
      explanationsKeys.forEach((explanation) => {
        EBEReport[`${filterId}${explanation}`] = {
          'count': 0,
          'criteriaId': filterId,
          'description': filtersMeta[filterId].explanations[explanation].replace(/\n/g, ' ').replace(/  +/g, ' ').trim()
        }
      })
    })

    report.forEach(occurrence => {
      const filterId = occurrence['criteria_id']
      const testDataFieldExplanationsIds = JSON.parse(occurrence['test_data_field_explanations_ids'])
      testDataFieldExplanationsIds.forEach((explanation) => {
        if (allFilters.indexOf(filterId) !== -1) {
          EBEReport[`${filterId}${explanation}`]['count'] += 1
        }
      })
    })

    let reportArray = Object.keys(EBEReport).map(key => EBEReport[key])
    reportArray.sort((a, b) => b['count'] - a['count'])

    let found = reportArray.find(function (element) {
      return (element.count === 0)
    })
    reportArray.splice(reportArray.indexOf(found))

    return reportArray
  },

  'errorByErrorToTsv': function (report) {
    const headers = ['count', 'criteriaId', 'description']

    let tsv = headers.join('\t')
    tsv += '\n'

    // Mounts TSV tsv
    report.forEach(occurrence => {
      const values = Object.keys(occurrence).map(key => occurrence[key])

      tsv += values.join('\t').replace('\n', ' ').trim()
      tsv += '\n'
    })

    return tsv
  },

  'parseFieldByFieldReport': function (report, datasetSize) {
    const parsed = []
    report.forEach(row => {
      const fields = JSON.parse(row['test_data_field_ids'])
      const values = JSON.parse(row['test_data_field_values'])
      const explanationsIds = JSON.parse(row['test_data_field_explanations_ids'])
      const errors = JSON.parse(row['test_data_field_error_types'])

      const occurrence = {
        'size': datasetSize,
        'criteria': row['criteria_id'],
        'tsvRowId': row['dataset_row_id'],
        'id': row['test_data_row_id'],
        'fields': fields.map((name, i) => ({ 'name': name, 'value': values[i] })),
        'explanationsIds': explanationsIds,
        'errors': errors
      }

      parsed.push(occurrence)
    })

    return parsed
  },

  'fieldByFieldToTsv': function (report, datasetSize) {
    const filtersMeta = require('../filters/filters-meta')
    const explanationCriteria = 'userExplanation'
    const headers = ['datasetSize', 'dataRowId', 'criteriaId', 'description', 'fields', 'errors']

    let tsv = headers.join('\t')
    tsv += '\n'

    report.forEach(row => {
      const fields = JSON.parse(row['test_data_field_ids'])
      const values = JSON.parse(row['test_data_field_values'])
      const explanationsIds = JSON.parse(row['test_data_field_explanations_ids'])
      const errors = JSON.parse(row['test_data_field_error_types'])

      // replaces line breaks and multiple whitespaces
      const description = filtersMeta[row['criteria_id']][explanationCriteria]
        .replace(/\n/g, ' ')
        .replace(/  +/g, ' ')
        .trim()

      const occurrence = [
        datasetSize,
        row['test_data_row_id'],
        row['criteria_id'],
        description,
        JSON.stringify(fields.map((name, i) => ({ 'name': name, 'value': values[i] }))).replace('\n', ' ').trim(),
        JSON.stringify(explanationsIds),
        JSON.stringify(errors)
      ]

      tsv += occurrence.join('\t')
      tsv += '\n'
    })

    return tsv
  }
}
