'use strict'

/**
 * @param {Array} dataset
 * @param {number} duplicatesThreshold Integer or Float number, representing the duplicates ratio.
 * @returns {{duplicatesRatio: number, numberOfDuplicates: number, exceeded: boolean}}
 */
module.exports = function (dataset, duplicatesThreshold) {
  // Rule: Let the duplicates ratio be the number of ISRCs which appear in more than one track divided by the
  // total number of tracks.

  let alreadyRegisteredISRCList = []

  let numberOfDuplicates = 0

  let totalNumberOfTracks = dataset.length

  dataset.forEach((row) => {
    if (row.hasOwnProperty('isrc') && row['isrc'].length > 0) {
      if (alreadyRegisteredISRCList.indexOf(row['isrc']) > -1) {
        numberOfDuplicates++
      } else {
        alreadyRegisteredISRCList.push(row['isrc'])
      }
    }
  })

  let duplicatesRatio = numberOfDuplicates / totalNumberOfTracks

  // Rule: Let exceeded be true if the duplicates ratio is equal to or greater than the value selected by the user

  let exceeded = (duplicatesRatio > duplicatesThreshold)

  // Rule: The REST API for the report summary should be extended to carry the duplicates ratio, the gross number
  // of duplicates, and the exceeded flag.

  return {
    duplicatesRatio: duplicatesRatio,
    numberOfDuplicates: numberOfDuplicates,
    exceeded: exceeded
  }
}
