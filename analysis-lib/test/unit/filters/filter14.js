const assert = require('chai').assert

const filterId = 'filter14'

const mocks = require(`../../../mocks/filters/${filterId}`)

const filter = require(`../../../src/filters/${filterId}`)

const ReportModule = require('../../../src/scripts/report-tool')

describe.skip(`should test ${filterId}`, function () {
  let report = new ReportModule()
  report.init()
  report.addFilter(filterId)
  this.timeout(10000)

  it('should not report - valid names', async () => {
    const mock = mocks['valid']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, report)

      assert.equal(occurrence, false)
    };
  })

  it('should not report - names not on musicbrainz', async () => {
    const mock = mocks['nameNotOnMusicbrainz']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, report)

      assert.equal(occurrence, false)
    };
  })

  it('should report - compound artists name', async () => {
    const mock = mocks['invalid']

    for (let idx in mock) {
      idx = parseInt(idx)
      const row = mock[idx]
      const occurrence = await filter(row, idx + 1, report)

      switch (occurrence.row_id) {
        case 1:
          assert.deepEqual(occurrence.field, ['release_artists_primary_artist', 'track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira', 'Beyoncé & Shakira'])
          break

        case 2:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira'])
          break

        case 3:
          assert.deepEqual(occurrence.field, ['track_artist'])
          assert.deepEqual(occurrence.value, ['Beyoncé & Shakira'])
          break
      }
    };
  })
})
