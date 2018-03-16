/* This module serves as a global variable for database information.
 * In order to avoid propagation on the code in case a database name changes,
 * they are all referenced in this file. Further information (e.g., columns
 * names) can be added here if needed. */
module.exports = {

  'analysis-lib': {
    'path': ['..', 'analysis-lib', 'db'], // path is relative to the root of the project
    'name': 'analysis-lib.db',

    'tables': {

      'field_by_field_reports': {
        'name': 'field_by_field_reports'
      },

      'orchard_dataset_contents': {
        'name': 'orchard_dataset_contents',
        'columns_dict': {
          'Release Name': 'release_name',
          'Release Meta Language': 'release_meta_language',
          'Orchard Artist': 'orchard_artist',
          'Artist Country': 'artist_country',
          'Subaccount Name': 'subaccount_name',
          'Artist URL': 'artist_url',
          'Release Artist(s)-Primary Artist(s)': 'release_artists_primary_artist',
          'Release Artist(s)-Featuring(s)': 'release_artists_featuring',
          'Release Artist(s)-Remixer(s)': 'release_artists_remixer',
          'Release Artist(s)-Composer(s)': 'release_artists_composer',
          'Release Artist(s)-Orchestra(s)': 'release_artists_orchestra',
          'Release Artist(s)-Ensemble(s)': 'release_artists_ensemble',
          'Release Artist(s)-Conductor(s)': 'release_artists_conductor',
          'Release Date': 'release_date',
          'Sale Start Date': 'sale_start_date',
          'iTunes Pre-Order': 'itunes_preorder',
          'iTunes Pre-Order Date': 'itunes_preorder_date',
          'Preorder Preview': 'preorder_preview',
          'Release iTunes Pricing': 'release_itunes_pricing',
          'Release Amazon Pricing': 'release_amazon_pricing',
          'Format: Full Length / EP / Single': 'format',
          'Imprint': 'imprint',
          'Genre': 'genre',
          'Sub-genre': 'sub_genre',
          '[C] Information': 'copyright_information',
          'Digital UPC': 'digital_upc',
          "Manufacturer's UPC": 'manufacturers_upc',
          'Folder Name / Label Catalog Number': 'label_catalog_number',
          'Release Version': 'release_version',
          'File Name': 'file_name',
          'Volume': 'volume',
          'Track No.': 'track_no',
          'Track Name': 'track_name',
          'Meta Language': 'meta_language',
          'Version': 'version',
          'Track Artist': 'track_artist',
          'Track Artist(s) - Featuring(s)': 'track_artist_featuring',
          'Track Artist(s) - Remixer(s)': 'track_artist_remixer',
          'Track Artist(s) - Composer(s)': 'track_artist_composer',
          'Track Artist(s) - Orchestra(s)': 'track_artist_orchestra',
          'Track Artist(s) - Ensemble(s)': 'track_artist_ensemble',
          'Track Artist(s) - Conductor(s)': 'track_artist_conductor',
          'Track iTunes Pricing': 'track_itunes_pricing',
          'Track Amazon Pricing': 'track_amazon_pricing',
          'Explicit (No/Yes/Clean)': 'explicit',
          'ISRC': 'isrc',
          '3rd Party Publisher? (Yes/No)': 'third_party_publisher',
          '[P] Information': 'p_information',
          'Songwriter(s)': 'songwriters',
          'Publisher(s)': 'publishers',
          'Only Include/Only Exclude?': 'only_include_exclude',
          'Territories (ISO Codes)': 'territories'
        }
      },

      'tsv_logs_table': {
        'name': 'tsv_logs_table'
      },

      'dataset_meta': {
        'name': 'dataset_meta'
      },

      'batch_results_reports': {
        'name': 'batch_results_reports'
      }

    }
  },

  'analysis-lib-test': {
    'path': ['.', 'db'],
    'name': 'analysis-lib-test.db',

    'tables': {

      'field_by_field_reports': {
        'name': 'field_by_field_reports'
      },

      'orchard_dataset_contents': {
        'name': 'orchard_dataset_contents',
        'columns_dict': {
          'Release Name': 'release_name',
          'Release Meta Language': 'release_meta_language',
          'Orchard Artist': 'orchard_artist',
          'Artist Country': 'artist_country',
          'Subaccount Name': 'subaccount_name',
          'Artist URL': 'artist_url',
          'Release Artist(s)-Primary Artist(s)': 'release_artists_primary_artist',
          'Release Artist(s)-Featuring(s)': 'release_artists_featuring',
          'Release Artist(s)-Remixer(s)': 'release_artists_remixer',
          'Release Artist(s)-Composer(s)': 'release_artists_composer',
          'Release Artist(s)-Orchestra(s)': 'release_artists_orchestra',
          'Release Artist(s)-Ensemble(s)': 'release_artists_ensemble',
          'Release Artist(s)-Conductor(s)': 'release_artists_conductor',
          'Release Date': 'release_date',
          'Sale Start Date': 'sale_start_date',
          'iTunes Pre-Order': 'itunes_preorder',
          'iTunes Pre-Order Date': 'itunes_preorder_date',
          'Preorder Preview': 'preorder_preview',
          'Release iTunes Pricing': 'release_itunes_pricing',
          'Release Amazon Pricing': 'release_amazon_pricing',
          'Format: Full Length / EP / Single': 'format',
          'Imprint': 'imprint',
          'Genre': 'genre',
          'Sub-genre': 'sub_genre',
          '[C] Information': 'copyright_information',
          'Digital UPC': 'digital_upc',
          "Manufacturer's UPC": 'manufacturers_upc',
          'Folder Name / Label Catalog Number': 'label_catalog_number',
          'Release Version': 'release_version',
          'File Name': 'file_name',
          'Volume': 'volume',
          'Track No.': 'track_no',
          'Track Name': 'track_name',
          'Meta Language': 'meta_language',
          'Version': 'version',
          'Track Artist': 'track_artist',
          'Track Artist(s) - Featuring(s)': 'track_artist_featuring',
          'Track Artist(s) - Remixer(s)': 'track_artist_remixer',
          'Track Artist(s) - Composer(s)': 'track_artist_composer',
          'Track Artist(s) - Orchestra(s)': 'track_artist_orchestra',
          'Track Artist(s) - Ensemble(s)': 'track_artist_ensemble',
          'Track Artist(s) - Conductor(s)': 'track_artist_conductor',
          'Track iTunes Pricing': 'track_itunes_pricing',
          'Track Amazon Pricing': 'track_amazon_pricing',
          'Explicit (No/Yes/Clean)': 'explicit',
          'ISRC': 'isrc',
          '3rd Party Publisher? (Yes/No)': 'third_party_publisher',
          '[P] Information': 'p_information',
          'Songwriter(s)': 'songwriters',
          'Publisher(s)': 'publishers',
          'Only Include/Only Exclude?': 'only_include_exclude',
          'Territories (ISO Codes)': 'territories'
        }
      },

      'tsv_logs_table': {
        'name': 'tsv_logs_table'
      },

      'dataset_meta': {
        'name': 'dataset_meta'
      },

      'batch_results_reports': {
        'name': 'batch_results_reports'
      }

    }
  }

}
