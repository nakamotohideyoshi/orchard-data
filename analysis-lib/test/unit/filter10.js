const assert = require('chai').assert;
const sinon = require('sinon');
const _ = require('lodash');
const path = require('path');
const validator = require('is-my-json-valid');

const mocks = require('../../mocks/filter10');
const filter = require('../../src/filters/filter10');

const filtersMeta = require('../../src/filters/filters-meta');
const reportModule = require('../../src/scripts/report-tool');

describe('should test filter 10', () => {

  let report = new reportModule();
  report.init();
  report.addFilter('filter10');

  // Valid
  it('should not report - no errors', () => {

    try {

      const mock = mocks['valid'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);
        console.log(occurrence)

        switch(idx) {

          case 0:
            assert.equal(occurrence, false);
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release name contains album', () => {

    try {

      const mock = mocks['releaseContainsAlbum'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Dawns Welcome to the Club - Album (feat. Ricky J)");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release name contains date', () => {

    try {

      const mock = mocks['releaseContainsDate'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "New York Eye & Ear Control (1964)");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - track name contains a number followed by period', () => {

    try {

      const mock = mocks['trackContainsNumber'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'track_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "12. I'll Be Walking Alone in a Crowd");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release name contains produced by', () => {

    try {

      const mock = mocks['releaseContainsProducedBy'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Produced By Mr. Spectacular)");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - track name contains produced by', () => {

    try {

      const mock = mocks['trackContainsProducedBy'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'track_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "9 of Disks (Produced By Jeff Bezos)");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release contains track artist name', () => {

    try {

      const mock = mocks['releaseContainsArtistName'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Camper Van Beethoven - Telephone Free Landslide Victory");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - track contains track artist name', () => {

    try {

      const mock = mocks['trackContainsArtistName'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'track_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Camper Van Beethoven - Where the Hell Is Bill?");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release name contains the string exclusive', () => {

    try {

      const mock = mocks['releaseContainsExclusive'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Exclusive)");
            break;

          case 1:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory [Exclusive]");
            break;

          case 2:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory - Exclusive");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - release name contains the string limited edition', () => {

    try {

      const mock = mocks['releaseContainsLimitedEdition'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        assert.equal(occurrence.field[0], 'release_name');

        switch(idx) {

          case 0:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Limited Edition)");
            break;

          case 1:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory [Limited Edition]");
            break;

          case 2:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory - Limited Edition");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

  it('should report - invalid occurrences in portuguese', () => {

    try {

      const mock = mocks['invalidPortugueseOccurrences'];

      mock.forEach((row, idx) => {

        let occurrence = filter(row, idx, report);

        assert.equal(_.isObject(occurrence), true);
        assert.equal(!_.isEmpty(occurrence.field), true);
        assert.equal(!_.isEmpty(occurrence.value), true);
        assert.equal(occurrence.field.length, occurrence.value.length);

        switch(idx) {

          case 0:
            assert.equal(occurrence.field[0], 'release_name');
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Produzido por Mr. Spectacular)");
            break;

          case 1:
            assert.equal(occurrence.field[0], 'track_name');
            assert.equal(occurrence.value[0], "9 of Disks (Produzido por Jeff Bezos)");
            break;

          case 2:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Exclusivo)");
            break;

          case 3:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory [Exclusivo]");
            break;

          case 4:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory - Exclusivo");
            break;

          case 5:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory (Edição Limitada)");
            break;

          case 6:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory [Edição Limitada]");
            break;

          case 7:
            assert.equal(occurrence.value[0], "Telephone Free Landslide Victory - Edição Limitada");
            break;

        }

      });

    }

    catch(err) { throw err; }

  });

});
