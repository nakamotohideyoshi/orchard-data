const path = require('path');

module.exports = {
    valid: {
        "source": path.resolve(__dirname, '..', 'data-tests', 'all-testcases.tsv'),
        "artist_blacklist": "test",
        "keyword_blacklist": "keywords",
        "duplicates_threshold": 1,
        "various_artists_threshold": 0,
        "lang": "en-US",
        "status": 1,
        "time": 1519073116716
    },
    invalid: {
        "source": path.resolve(__dirname, '..', 'data-tests', 'all-testcases-NOT-A-VALID-FILE.tsv'),
        "artist_blacklist": "test",
        "keyword_blacklist": "keywords",
        "duplicates_threshold": 1,
        "various_artists_threshold": 0,
        "lang": "en-US",
        "status": 1,
        "time": 1519073116716
    },
    invalidDatatypes: {
        "source": null,
        "artist_blacklist": null,
        "keyword_blacklist": null,
        "duplicates_threshold": null,
        "various_artists_threshold": null,
        "lang": null,
        "status": null,
        "time": null
    },
    missingArguments: {
        "artist_blacklist": "test",
        "keyword_blacklist": "keywords",
        "duplicates_threshold": 1,
        "various_artists_threshold": 0,
        "lang": "en-US",
        "status": 1,
        "time": 1519073116716
    },
    nullObject: null
};