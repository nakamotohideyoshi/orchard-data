const mb = require('musicbrainz');

module.exports = {

  // Returns a list of artists.
  'searchArtists': function(artist) {

    const artists = new Promise((resolve, reject) => {

      mb.searchArtists(artist, {}, (err, artists) => {

        if(err) { reject(err); }
        resolve(artists);

      });

    });

    return artists;

  },

  // looks if an artists occurs on the list returned by searchArtists
  'checkForArtistInMB': function(value, artists) {

    const removeDiacritics = require('./remove-diacritics');

    let match = false;

    // Check if this name is valid
    for(let i = 0; i < artists.length; i++) {

      const artist = artists[i];

      const name = removeDiacritics(artist.name).trim().toLowerCase();
      value = removeDiacritics(value).trim().toLowerCase();

      if(value === name) {
        match = true;
        break;
      }

      const aliases = artist.aliases;

      for(let j = 0; j < aliases.length; j++) {

        const alias = removeDiacritics(aliases[j]).trim().toLowerCase();

        if(value === alias) {
          match = true;
          break;
        }

      }

    };

    return match;

  },


};
