const assert = require('chai').assert
const _ = require('lodash')

const filterId = 'filter10'

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

  it('validates occurrences fields', () => {
    let mock = mocks['releaseContainsAlbum']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      assert.equal(_.isObject(occurrence), true)
      assert.equal(!_.isEmpty(occurrence.field), true)
      assert.equal(!_.isEmpty(occurrence.value), true)
      assert.equal('explanation_id' in occurrence, true)
      assert.equal('error_type' in occurrence, true)
      assert.equal(occurrence.value.length, occurrence.field.length)
      assert.equal(occurrence.value.length, occurrence.explanation_id.length)
      assert.equal(occurrence.value.length, occurrence.error_type.length)
    })
  })

  // Valid
  it('should not report - no errors', () => {
    const mock = mocks['valid']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)

      switch (idx) {
        case 0:
          assert.equal(occurrence, false)
          break
      }
    })
  })

  it('should report - release name contains album', () => {
    const mock = mocks['releaseContainsAlbum']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Dawns Welcome to the Club - Album (feat. Ricky J)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - release name contains date', () => {
    const mock = mocks['releaseContainsDate']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['New York Eye & Ear Control (1964)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, ['warning'])
          break
      }
    })
  })

  it('should report - track name contains a number followed by period', () => {
    const mock = mocks['trackContainsNumber']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['track_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ["12. I'll Be Walking Alone in a Crowd"])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])

          break
      }
    })
  })

  it('should report - release name contains produced by', () => {
    const mock = mocks['releaseContainsProducedBy']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Produced By Mr. Spectacular)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - track name contains produced by', () => {
    const mock = mocks['trackContainsProducedBy']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['track_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['9 of Disks (Produced By Jeff Bezos)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - release contains track artist name', () => {
    const mock = mocks['releaseContainsArtistName']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Camper Van Beethoven - Telephone Free Landslide Victory'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - track contains track artist name', () => {
    const mock = mocks['trackContainsArtistName']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['track_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Camper Van Beethoven - Where the Hell Is Bill?'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - release name contains the string exclusive', () => {
    const mock = mocks['releaseContainsExclusive']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Exclusive)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory [Exclusive]'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory - Exclusive'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - release name contains the string limited edition', () => {
    const mock = mocks['releaseContainsLimitedEdition']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      assert.deepEqual(occurrence.field, ['release_name'])

      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Limited Edition)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory [Limited Edition]'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory - Limited Edition'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })

  it('should report - invalid occurrences in portuguese', () => {
    const mock = mocks['invalidPortugueseOccurrences']

    mock.forEach((row, idx) => {
      let occurrence = filter(row, idx, report)
      switch (idx) {
        case 0:
          assert.deepEqual(occurrence.field, ['release_name'])
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Produzido por Mr. Spectacular)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 1:
          assert.deepEqual(occurrence.field, ['track_name'])
          assert.deepEqual(occurrence.value, ['9 of Disks (Produzido por Jeff Bezos)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 2:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Exclusivo)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 3:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory [Exclusivo]'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 4:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory - Exclusivo'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 5:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory (Edição Limitada)'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 6:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory [Edição Limitada]'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break

        case 7:
          assert.deepEqual(occurrence.value, ['Telephone Free Landslide Victory - Edição Limitada'])
          assert.deepEqual(occurrence.explanation_id, [defaultExplanationId])
          assert.deepEqual(occurrence.error_type, [defaultErrorType])
          break
      }
    })
  })
})
