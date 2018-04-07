const assert = require('chai').assert

const filterId = require('path').parse(__filename).name

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta['type']
const defaultExplanationId = 'default'

const ReportModule = require('../../../src/scripts/report-tool')

describe(`should test ${filterId}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('Pass: Valid "Various Artists" spell', () => {
    const mock = mocks['validString']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)

      assert.equal(occurrence, false)
    })
  })

  it('Failed: misspelled "Various Artists" (Various)', () => {
    const mock = mocks['invalidString']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx)
      assert.deepEqual(occurrence.field, ['release_artists_primary_artist'])
      switch (occurrence.rowId) {
        case 0:
          assert.deepEqual(occurrence.value, ['Various'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })
})
