module.exports = {
  validTrack1: {
    track_name: 'Lorem Ipsum',
    track_artist: 'first',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  },

  validTrack2: {
    track_name: 'Lorem (first vs. second) Ipsum',
    track_artist: 'first|second',
    track_artist_featuring: 'fourth',
    track_artist_remixer: 'third'
  },

  invalidTrack1: {
    track_name: 'Lorem (first Meets second) Ipsum',
    track_artist: 'first',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  },

  invalidTrack2: {
    track_name: 'Lorem (first vs. second) Ipsum',
    track_artist: 'first',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  },

  invalidTrack3: {
    track_name: 'Lorem Ipsum',
    track_artist: 'first meets second',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  },

  invalidTrack4: {
    track_name: 'Lorem Ipsum',
    track_artist: 'first vs. second',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  },

  invalidTrack5: {
    track_name: 'Lorem Ipsum',
    track_artist: 'first',
    track_artist_featuring: 'first vs. second',
    track_artist_remixer: 'third'
  },

  invalidTrack6: {
    track_name: 'Lorem Ipsum',
    track_artist: 'first',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third meets second'
  },

  invalidTrack7: {
    track_name: 'Lorem (first meets second) Ipsum',
    track_artist: 'first|second',
    track_artist_featuring: 'second',
    track_artist_remixer: 'third'
  }
}
