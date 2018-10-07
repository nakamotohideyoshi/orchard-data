const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const ReportModule = require('../../../src/scripts/report-tool')

const filterId = require('path').parse(__filename).name
const mocks = require(`../../../mocks/filters/${filterId}`)
const filter = require(`../../../src/filters/${filterId}`)
const filterMeta = require('../../../src/filters/filters-meta')[filterId]

const defaultErrorType = filterMeta.type
const defaultExplanationId = 'default'

describe(`should test ${filterId}: ${filterMeta['orchardDescription']}`, () => {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)

  it('should pass: validTrack1', () => {
    let mock = mocks.validTrack1
    let occurrence = filter(mock, 0)
    assert.equal(occurrence, false)
  })

  it('should pass: validTrack2', () => {
    let mock = mocks.validTrack2
    let occurrence = filter(mock, 0)
    assert.equal(occurrence, false)
  })

  it('should fail: invalidTrack1', () => {
    let mock = mocks.invalidTrack1
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist'])
    assert.deepEqual(occurrence.value, ['first'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack2', () => {
    let mock = mocks.invalidTrack2
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist'])
    assert.deepEqual(occurrence.value, ['first'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack3', () => {
    let mock = mocks.invalidTrack3
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist'])
    assert.deepEqual(occurrence.value, ['first meets second'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack4', () => {
    let mock = mocks.invalidTrack4
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist'])
    assert.deepEqual(occurrence.value, ['first vs. second'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack5', () => {
    let mock = mocks.invalidTrack5
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist_featuring'])
    assert.deepEqual(occurrence.value, ['first vs. second'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack6', () => {
    let mock = mocks.invalidTrack6
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_artist_remixer'])
    assert.deepEqual(occurrence.value, ['third meets second'])
    assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
    assert.deepEqual(occurrence.error_type, [defaultErrorType])
  })

  it('should fail: invalidTrack7', () => {
    let mock = mocks.invalidTrack7
    let occurrence = filter(mock, 0)
    assert.deepEqual(occurrence.field, ['track_name'])
    assert.deepEqual(occurrence.value, ['Lorem (first meets second) Ipsum'])
    assert.deepEqual(occurrence.explanation_id, ['capitalization'])
    assert.deepEqual(occurrence.error_type, ['warning'])
  })
})
