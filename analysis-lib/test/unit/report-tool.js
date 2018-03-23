const assert = require('chai').assert

const filtersMeta = require('../../src/filters/filters-meta')
const ReportModule = require('../../src/scripts/report-tool')
const reportUtils = require('../../src/scripts/report-utils')

const mocks = require('../../mocks/reports/reports')

describe('should test report tool', () => {
  let report
  let filter

  beforeEach(() => {
    report = new ReportModule()
    report.init(1)

    filter = 'filter1'
    report.addFilter(filter)
  })

  it('should test add filter', () => {
    let filterDesc = filtersMeta[filter]

    let obj = {}
    obj[filter] = { 'occurs_on': {} }

    Object.keys(filterDesc).forEach(key => {
      obj[filter][key] = filterDesc[key]
    })
    assert.deepEqual(report.filters[filter], obj[filter])
  })

  it('should test add occurrence', () => {
    let occurrences = mocks['field_by_field']['occurrences']

    let occurrenceReport = {}

    occurrenceReport['1'] = {
      'row_id': 1,
      'fields': ['release_name'],
      'values': ['A value'],
      'explanations_ids': [-1],
      'error_types': ['error']
    }

    report.addOccurrence(filter, occurrences[0])
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrenceReport)

    occurrenceReport['2'] = {
      'row_id': 2,
      'fields': ['track_name'],
      'values': ['Another value'],
      'explanations_ids': [1],
      'error_types': ['warning']
    }

    report.addOccurrence(filter, occurrences[1])
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrenceReport)
    occurrenceReport['3'] = {
      'row_id': 3,
      'fields': ['release_name', 'track_name'],
      'values': ['A value', 'Another value'],
      'explanations_ids': [1, -1],
      'error_types': ['warning', 'error']
    }

    report.addOccurrence(filter, occurrences[2])
    assert.deepEqual(report.filters[filter]['occurs_on'], occurrenceReport)
  })

  it('should test field by field report', () => {
    // Adds occurrences
    mocks['field_by_field']['occurrences'].forEach(occurrence => report.addOccurrence(filter, occurrence))

    report.calcFieldByFieldReportAll()
      .then(FBFReport => {
        let report = mocks['field_by_field']['field_by_field_report']
        assert.deepEqual(report, FBFReport)
      })
  })

  it('should test error by error report tsv', () => {
    const FBFReport = mocks['error_by_error']['field_by_field_report']
    const EBEReportMock = []

    Object.keys(filtersMeta).forEach(filterId => {
      const obj = {
        'count': 0,
        'criteriaId': filterId,
        'description': filtersMeta[filterId]['userExplanation'].replace(/\n/g, ' ').replace(/  +/g, ' ').trim()

      }

      if (filterId === 'filter1' || filterId === 'filter2') { obj['count'] = 3 }

      EBEReportMock.push(obj)
    })

    EBEReportMock.sort((a, b) => b['count'] - a['count'])

    const headers = ['count', 'criteriaId', 'description']
    let tsv = headers.join('\t')
    tsv += '\n'

    EBEReportMock.forEach(occurrence => {
      const values = Object.keys(occurrence).map(key => occurrence[key])

      tsv += values.join('\t')
      tsv += '\n'
    })

    const EBEReport = reportUtils.errorByError(FBFReport)
    const EBEReportTsv = reportUtils.errorByErrorToTsv(EBEReport)
    assert.deepEqual(EBEReportTsv, tsv)
  })

  it('should test row by row report', () => {
    const FBFReport = mocks['row_by_row']['field_by_field_report']
    let RBRReportMock = []
    const datasetSize = 5

    for (let i = 1; i <= datasetSize; i++) {
      const obj = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS',
        'acceptability': 'GREEN'
      }

      switch (i) {
        case 1:
          obj['errors'] = 2
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'RED'
          break

        case 2:
          obj['errors'] = 1
          obj['warnings'] = 1
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'YELLOW'
          break

        case 3:
          obj['errors'] = 2
          obj['warnings'] = 2
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'RED'
          break
      }

      RBRReportMock.push(obj)
    }

    RBRReportMock = RBRReportMock.sort((a, b) => {
      let aProblems = a['errors'] + a['warnings']
      let bProblems = b['errors'] + b['warnings']

      return bProblems - aProblems || b['errors'] - a['errors']
    })

    const RBRReport = reportUtils.rowByRow(FBFReport, datasetSize)
    assert.deepEqual(RBRReport, RBRReportMock)
  })

  it('should test row by row report tsv', () => {
    const FBFReport = mocks['row_by_row']['field_by_field_report']
    let RBRReportMock = []
    const datasetSize = 5

    for (let i = 1; i <= datasetSize; i++) {
      const obj = {
        'rowID': i,
        'errors': 0,
        'warnings': 0,
        'grade': 'PASS',
        'acceptability': 'GREEN'
      }

      switch (i) {
        case 1:
          obj['errors'] = 2
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'RED'
          break

        case 2:
          obj['errors'] = 1
          obj['warnings'] = 1
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'YELLOW'
          break

        case 3:
          obj['errors'] = 2
          obj['warnings'] = 2
          obj['grade'] = 'ERROR'
          obj['acceptability'] = 'RED'
          break
      }

      RBRReportMock.push(obj)
    }

    RBRReportMock = RBRReportMock.sort((a, b) => {
      let aProblems = a['errors'] + a['warnings']
      let bProblems = b['errors'] + b['warnings']

      return bProblems - aProblems || b['errors'] - a['errors']
    })

    const headers = ['rowId', 'errors', 'warnings', 'grade', 'acceptability']
    let tsv = headers.join('\t')
    tsv += '\n'

    RBRReportMock.forEach(occurrence => {
      const values = Object.keys(occurrence).map(key => occurrence[key])

      tsv += values.join('\t')
      tsv += '\n'
    })

    const RBRReport = reportUtils.rowByRow(FBFReport, datasetSize)
    const RBRReportTsv = reportUtils.rowByRowToTsv(RBRReport)
    assert.deepEqual(RBRReportTsv, tsv)
  })
})
