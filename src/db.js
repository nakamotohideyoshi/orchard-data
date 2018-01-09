
/*
https://github.com/mapbox/node-sqlite3/wiki/API
*/
var sqlite3 = require('sqlite3').verbose()
var DB = new sqlite3.Database('DB.sqlite')

module.exports = {
  initialize: function () {
    // fixme: try to open existing database

    console.log('BP 1', DB.run('CREATE TABLE IF NOT EXISTS dataset_params (source_file TEXT, artist_blacklist TEXT, keyword_blacklist TEXT, duplicates_threshold INTEGER, various_artists_threshold INTEGER, lang text, status INTEGER, time INTEGER)'))

    console.log('BP 2', DB.run('create table orchard_dataset_contents ( dataset_id foreign_key, release_name text, release_meta_language text, orchard_artist text, artist_country text, subaccount_name text, artist_url text, release_artists_primary_artist text, release_artists_featuring text, release_artists_remixer text, release_artists_composer text, release_artists_orchestra text, release_artists_ensemble text, release_artists_conductor text, release_date text, sale_start_date text, itunes_preorder text, itunes_preorder_date text, preorder_preview text, release_itunes_pricing text, release_amazon_pricing text, format text, imprint text, genre text, sub_genre text, copyright_information text, digital_upc text, manufacturers_upc text, label_catalog_number text, release_version text, file_name text, volume text, track_no text, track_name text, meta_language text, version text, track_artist text, track_artist_featuring text, track_artist_remixer text, track_artist_composer text, track_artist_orchestra text, track_artist_ensemble text, track_artist_conductor text, track_itunes_pricing text, track_amazon_pricing text, explicit text, isrc text, third_party_publisher text, p_information text, songwriters text, publishers text, only_include_exclude text, territories text )'))

    return DB
  },

  saveNewBatch: function (sourceFile, artistBlacklist, keywordBlacklist, duplicatesThreshold, variousArtistsThreshold, lang, status, creationDate) {
    DB.serialize(function (source_file, artist_blacklist, keyword_blacklist, duplicates_threshold, various_artists_threshold, lang, status) {
       var stmt = DB.prepare('INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
       stmt.run(sourceFile, artistBlacklist, keywordBlacklist, duplicatesThreshold, variousArtistsThreshold, lang, status, creationDate)
       stmt.finalize()
       DB.close()
   }
  }
} // end module.exports
