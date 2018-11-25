module.exports = {
  shouldFailCaseOfMeets: {
    dataset: [
      {
        release_name: 'A meets B',
        track_no: '1',
        release_artists_primary_artist: 'A|B',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Lorem',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651401',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldFailCaseOfVs: {
    dataset: [
      {
        release_name: 'C VS. D',
        track_no: '1',
        release_artists_primary_artist: 'C|D',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Ipsum',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651402',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldFailDotAfterVs: {
    dataset: [
      {
        release_name: 'E vs F',
        track_no: '1',
        release_artists_primary_artist: 'E|F',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Dolor',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651403',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldFailPrimaryArtistNotPartAOrPartBOrTheirConcatenationDelimiterIsVs: {
    dataset: [
      {
        release_name: 'G vs. H',
        track_no: '1',
        release_artists_primary_artist: 'Does Not Match',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Sit',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651404',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldPassPrimaryArtistIsPartA: {
    dataset: [
      {
        release_name: 'I vs. J',
        track_no: '1',
        release_artists_primary_artist: 'I',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Amet',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651405',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldPassPrimaryArtistIsPartB: {
    dataset: [
      {
        release_name: 'K vs. L',
        track_no: '1',
        release_artists_primary_artist: 'L',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Consectateur',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651406',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldFailPrimaryArtistNotPartAOrPartBOrTheirConcatenationDelimiterIsMeets: {
    dataset: [
      {
        release_name: 'M Meets N',
        track_no: '1',
        release_artists_primary_artist: 'Does Not Match',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Adipiscing',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651407',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldPassPrimaryArtistIsPartAPartBNoSpacesAroundPipe: {
    dataset: [
      {
        release_name: 'O vs. P',
        track_no: '1',
        release_artists_primary_artist: 'O|P',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Elit',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651408',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldPassPrimaryArtistIsPartAPartBWhitespaceAroundPipe: {
    dataset: [
      {
        release_name: 'Q vs. R',
        track_no: '1',
        release_artists_primary_artist: 'Q | R',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Sed',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651409',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  },
  shouldPassPrimaryArtistIsPartBPartA: {
    dataset: [
      {
        release_name: 'S vs. T',
        track_no: '1',
        release_artists_primary_artist: 'T|S',
        release_meta_language: 'English',
        orchard_artist: 'Cicero',
        artist_country: 'USA',
        format: 'Full Length',
        imprint: 'Example Label',
        genre: 'Music',
        sub_genre: 'West Coast Rap',
        label_catalog_number: 'Cat-number-12345',
        volume: '1',
        track_name: 'Do',
        meta_language: 'English',
        track_artist: 'Cicero',
        explicit: 'No',
        isrc: 'QMJYX1651410',
        p_information: '2018 Viva Data',
        songwriters: 'Cicero',
        publishers: 'Viva Data'
      }
    ]
  }
}
