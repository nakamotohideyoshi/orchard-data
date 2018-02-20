module.exports = {
    required: true,
    type: 'object',
    properties: {
        artist_blacklist: {
            type: 'string'
        },
        duplicates_threshold: {
            type: 'number'
        },
        keyword_blacklist: {
            type: 'string'
        },
        lang: {
            type: 'string'
        },
        source: {
            type: 'string'
        },
        status: {
            type: 'number'
        },
        time: {
            type: 'number'
        },
        various_artists_threshold: {
            type: 'number'
        }
    },
    required: [
        'artist_blacklist',
        'duplicates_threshold',
        'keyword_blacklist',
        'lang',
        'source',
        'status',
        'time',
        'various_artists_threshold'
    ]
};