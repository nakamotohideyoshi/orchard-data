
module.exports = {

  'datasetToTSV': function (dataset, datasetSize) {
    let headers = []

    // Generate Headers
    if (datasetSize !== 0) {
      headers.push('rowID')
      headers = headers.concat(Object.keys(dataset[0]).map(key => key))
    }

    // Convert headers to TSV
    let tsv = headers.join('\t')
    tsv += '\n'

    // Convert dataset to TSV
    for (let i = 1; i <= datasetSize; i++) {
      // Add rowID
      const data = Object.assign({'rowID': i}, dataset[ i - 1 ])
      const values = Object.keys(data).map(key => data[key])

      // Mount TSV tsv
      tsv += values.join('\t')
      tsv += '\n'
    }
    return tsv
  }

}
